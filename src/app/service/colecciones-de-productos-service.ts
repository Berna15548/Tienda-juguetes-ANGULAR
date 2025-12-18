import { Injectable } from '@angular/core';
import {
  productCollectionCard,
  Producto
} from "../interfaces/interfaces";
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  deleteDoc,
  doc,
} from "@angular/fire/firestore";
import {
  BehaviorSubject,
  Observable
} from "rxjs";
import { ProductosService } from "./productos-service";
import {writeBatch} from "firebase/firestore";
import {getDocs} from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
class ColeccionesDeProductosService {

  private coleccionSubject = new BehaviorSubject<productCollectionCard[]>([]);
  public coleccionDeProductos$ = this.coleccionSubject.asObservable();
  private productosFiltradosSubject = new BehaviorSubject<Producto[]>([]);
  public productosFiltradosParaCartasDeColecciones$ = this.productosFiltradosSubject.asObservable();
  public listaDeIDsProductosParaPushearEnCartaDeColeccion: string [] = [];
  public buscadorProductosCartasDeColecciones: string = ''; 

  public productoSeleccionadoParaCartaDeColeccion: Producto = {
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: '',
    categoria: '',
    stock: 0,
    marca: '',
    rango_edades: "Todas las edades",
    descuento: 0,
  };
  


  constructor(private firestore: Firestore, private productosService : ProductosService) {
    this.getColeccionDeProductos().subscribe({
      next: collection => {
        this.coleccionSubject.next(collection);
      },
      error: err => {
        console.error('Error al obtener productCollection desde Firebase:', err);
      }
    });
  }

  private getColeccionDeProductos(): Observable<productCollectionCard[]> {
    const coleccionDeProductosRef = collection(this.firestore, 'colecciones_de_productos');
    return collectionData(coleccionDeProductosRef, { idField: 'id' }) as Observable<productCollectionCard[]>;
  }

  eliminarProductoDeColeccion(id: any) {
    const coleccionEliminada = this.coleccionSubject.getValue().find(c => c.id === id);

    if (coleccionEliminada) {
      console.log(`Se llamó a eliminarProductoDeColeccion, colección a eliminar: ${coleccionEliminada.name} (id: ${id})`);
    } else {
      console.log(`Se llamó a eliminarProductoDeColeccion, colección con id ${id} no encontrada.`);
    }

    const docRef = doc(this.firestore, `colecciones_de_productos/${id}`);
    return deleteDoc(docRef);
  }

  async agregarColeccion(producto: {
    name: string;
    description: string;
    image: string;
    lista_productos_coleccion: string[]
  }) {
    const coleccionRef = collection(this.firestore, 'colecciones_de_productos');

    const docRef = await addDoc(coleccionRef, producto);
    
  }


  filtrarProductosParaCartasDeColecciones() {
    const termino = this.buscadorProductosCartasDeColecciones.toLowerCase().trim();

    if (termino.length === 0) {
      console.log("🟡 Término vacío, vaciando productosFiltradosParaCartasDeColecciones");
      this.productosFiltradosSubject.next([]); // <- usar .next para emitir
      return;
    }

    const productos = this.productosService['trendProducts'].getValue();

    const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino)
    );

    this.productosFiltradosSubject.next(filtrados); // <- emitimos el nuevo array
  }

  limpiarProductosFiltradosParaCartasDeColecciones(){
    this.productosFiltradosSubject.next([]);
    console.log('🔴 productosFiltradosSubject ahora:', this.productosFiltradosSubject.getValue());
  }


  limpiarProductoSeleccionadoParaCartasDeColecciones() {
    const termino = this.buscadorProductosCartasDeColecciones;
    if (termino === '') {
      console.log("se limpio el producto seleccionado para descontar");
      this.productosFiltradosSubject.next([]);
    }
  }
  
  seleccionarProductoParaNuevaCartaDeColeccion(producto: Producto) {
    this.productoSeleccionadoParaCartaDeColeccion = producto;
    this.listaDeIDsProductosParaPushearEnCartaDeColeccion.push(producto.id);
    this.buscadorProductosCartasDeColecciones = this.productoSeleccionadoParaCartaDeColeccion.nombre

  }


  async limpiarColeccionesHuerfanas() {
    console.log('Iniciando limpieza de colecciones huérfanas...');

    const batch = writeBatch(this.firestore);

    const productosSnapshot = await getDocs(collection(this.firestore, 'productos'));
    const idsValidos = new Set<string>();
    productosSnapshot.forEach(doc => doc.id && idsValidos.add(doc.id));

    const coleccionesSnapshot = await getDocs(collection(this.firestore, 'colecciones_de_productos'));
    const promesasBorrado: Promise<void>[] = [];

    for (const coleccionDoc of coleccionesSnapshot.docs) {
      const data = coleccionDoc.data() as productCollectionCard;
      const listaActual = (data.lista_productos_coleccion || []) as string[];

      const idsQueExisten = listaActual.filter(id => idsValidos.has(id));

      if (idsQueExisten.length === 0) {
        promesasBorrado.push(
            deleteDoc(doc(this.firestore, 'colecciones_de_productos', coleccionDoc.id))
        );
        console.log(`Colección "${data.name || 'sin nombre'}" será eliminada (vacía)`);
      } else if (idsQueExisten.length < listaActual.length) {
        // Limpiar IDs huérfanos
        batch.update(coleccionDoc.ref, {
          lista_productos_coleccion: idsQueExisten
        });
        console.log(`Colección "${data.name || 'sin nombre'}" limpiada: removidos ${listaActual.length - idsQueExisten.length} productos`);
      }
    }

    await batch.commit();
    console.log('Actualizaciones de colecciones aplicadas');

    if (promesasBorrado.length > 0) {
      await Promise.all(promesasBorrado);
      console.log(`${promesasBorrado.length} colecciones vacías eliminadas`);
    }

    console.log('Limpieza completada con éxito');
  }
}

export default ColeccionesDeProductosService






