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
  updateDoc,
} from "@angular/fire/firestore";
import {
  BehaviorSubject,
  Observable
} from "rxjs";
import { ProductosService } from "./productos-service";

@Injectable({
  providedIn: 'root'
})
export class ColeccionesDeProductosService {

  private coleccionSubject = new BehaviorSubject<productCollectionCard[]>([]);
  public coleccionDeProductos$ = this.coleccionSubject.asObservable();
  private productosFiltradosSubject = new BehaviorSubject<Producto[]>([]);
  public productosFiltradosParaCartasDeColecciones$ = this.productosFiltradosSubject.asObservable();
  public listaDeIDsProductosParaPushearEnCartaDeColeccion: string [] = [];
  public buscadorProductosCartasDeColecciones: string = ''; // es el searchTearm de cartas de colecciones

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
        console.error('❌ Error al obtener productCollection desde Firebase:', err);
      }
    });
  }

  private getColeccionDeProductos(): Observable<productCollectionCard[]> {
    const coleccionDeProductosRef = collection(this.firestore, 'colecciones_de_productos');
    return collectionData(coleccionDeProductosRef, { idField: 'id' }) as Observable<productCollectionCard[]>;
  }

  eliminarProductoDeColeccion(id: any) {
    // Buscar la colección por id en el último valor emitido
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

    // 1. Agregar sin route
    const docRef = await addDoc(coleccionRef, producto);


  }


  filtrarProductosParaCartasDeColecciones() {
    const termino = this.buscadorProductosCartasDeColecciones.toLowerCase().trim();
    console.log("🔍 Se llamó a filtrarProductosParaCartasDeColecciones()");

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
    console.log("se llamo a seleccionarProductoParaNuevaCartaDeColeccion()")
    this.productoSeleccionadoParaCartaDeColeccion = producto;
    this.listaDeIDsProductosParaPushearEnCartaDeColeccion.push(producto.id);
    this.buscadorProductosCartasDeColecciones = this.productoSeleccionadoParaCartaDeColeccion.nombre // se autocompleta el nombre al clikear

  }
























}
