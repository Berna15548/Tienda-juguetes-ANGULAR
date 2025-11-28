import { Injectable } from '@angular/core';
import { ProductosService } from "./productos-service";
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc
} from "@angular/fire/firestore";
import {
  newProductsCollection,
  Producto
} from "../interfaces/interfaces";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable
} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewProductsService {
  private coleccionProductosNuevosSubject = new BehaviorSubject<newProductsCollection[]>([]);
  public coleccionProductosNuevosSubject$ = this.coleccionProductosNuevosSubject.asObservable();
  private productosNuevosSubject = new BehaviorSubject<(Producto & newProductsCollection)[]>([]);
  public productosNuevosSubject$ = this.productosNuevosSubject.asObservable();
  public listaProductosNuevos: newProductsCollection[] = []; //"newproduct" seleccionado por el usuario
  public inputNombreProductoNuevo : string = '';
  public listaProductosNuevosFiltrados: (Producto & newProductsCollection)[] = [];
  
  productoSeleccionadoParaNuevosProductos: Producto = {
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: '',
    categoria: '',
    stock: 0,
    marca: '',
    rango_edades: "Todas las edades",
    descuento: 0,
  }

  
  constructor(
      private firestore: Firestore,
      private productosService: ProductosService
  ) {
    this.getColeccionDeProductosNuevos().subscribe({
      next: collection => this.coleccionProductosNuevosSubject.next(collection),
      error: err => console.error('❌ Error al obtener poductos nuevos:', err)
    });

    this.cargarProductosNuevos();
  }

  getProductosNuevos(): Observable<(Producto & newProductsCollection)[]> {
    console.log('se llamo a getProductosNuevos');
    return combineLatest([
      this.productosService.getProductos(),        // productos
      this.coleccionProductosNuevosSubject$                  // productos nuevos
    ]).pipe(
        map(([productos, newProducts]) => {
          return productos
              .map(producto => {
                const productoNuevo = newProducts.find(d => d.productId === producto.id);
                return productoNuevo
                    ? { ...producto, ...productoNuevo }
                    : null;
              })
              .filter((p): p is Producto & newProductsCollection => p !== null);
        })
    );
  }

  private getColeccionDeProductosNuevos(): Observable<newProductsCollection[]> {
    const coleccionDeNuevosProductosRef = collection(this.firestore, 'coleccion_de_productos_nuevos');
    return collectionData(coleccionDeNuevosProductosRef, { idField: 'id' }) as Observable<newProductsCollection[]>;
  }


  private cargarProductosNuevos(): void {
    this.getProductosNuevos().subscribe({
      next: (productosNuevos) => {
        this.productosNuevosSubject.next(productosNuevos);
        console.log('🔹 productos nuevos actualizados:', productosNuevos);
      },
      error: (err) => {
        console.error("❌ Error al obtener productos nuevos:", err);
        this.productosNuevosSubject.next([]);
      }
    });
  }
  
  

  limpiarProductoSeleccionadoParaNuevosProductos(){
    const termino = this.productosService.buscadorNuevosProductosService;
    if (termino==='') {
      console.log("se limpio el producto seleccionado para descontar")

      this.productoSeleccionadoParaNuevosProductos = {
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
    }
  }

  seleccionarProductoParaNuevosProductos(producto: Producto) {
    this.productoSeleccionadoParaNuevosProductos = producto;
    this.productosService.buscadorNuevosProductosService = this.productoSeleccionadoParaNuevosProductos.nombre // se autocompleta el nombre al clikear
    console.log("se llamo a seleccionarProductoParaNuevosProductos()");
  }


  async agregarNuevoProductoNuevo() {
    try {
      // Crear el objeto con id 
      const nuevoObjeto: newProductsCollection = {
        productId: this.productoSeleccionadoParaNuevosProductos.id,
      };
      // Llamar al servicio para guardar
      const id = await this.agregarColeccionDeProductosNuevos(nuevoObjeto);
      console.log('New Product agregado con id:', id);

    } catch (error) {
      console.error('Error agregando producto a la coleccion de nuevos productos:', error);
    }
    // Limpiar inputs y variables
    this.productosService.buscadorNuevosProductosService = '';
    this.limpiarProductoSeleccionadoParaNuevosProductos()

  }

  async agregarColeccionDeProductosNuevos(productoNuevo: Omit<newProductsCollection, 'id'>): Promise<string> {
    const coleccionRef = collection(this.firestore, 'coleccion_de_productos_nuevos');

    const docRef = await addDoc(coleccionRef, productoNuevo);

    const rutaGenerada = `/newProductCollection-${docRef.id}`;
    await updateDoc(docRef, { route: rutaGenerada });

    return docRef.id;  // Esto devuelve el id para confirmar
  }

  seleccionarProductoNuevoParaEliminarDeLista(ProductoNuevo: Producto & newProductsCollection) {
    const idProductoNuevo : string = ProductoNuevo.productId;
    console.log("se llamo a seleccionarProductoNuevoParaEliminarDeLista()");

    if (this.inputNombreProductoNuevo.length === 0) {
      this.listaProductosNuevos = [];
      console.log("se vacio listaProductosNuevos")
      return
    }
    this.inputNombreProductoNuevo = ProductoNuevo.nombre // autocompleta el buscador con el nombre del producto
    const constanteListaProductosNuevos = this.coleccionProductosNuevosSubject.getValue();
    const productoNuevo : newProductsCollection | undefined = constanteListaProductosNuevos.find(item => item.productId === idProductoNuevo);

    if (productoNuevo) {
      this.listaProductosNuevos = [productoNuevo];
    } else {
      console.log("No se encontro el descuento del productoNuevo");
    }
  }

  async borrarProductoDeListaProductosNuevosService() {
    if (!this.listaProductosNuevos.length) {
      console.log("⚠️ No hay producto nuevo seleccionado para eliminar");
      return;
    }

    const idDoc = this.listaProductosNuevos[0].id;
    if (!idDoc) {
      console.error("❌ No se encontró el ID del producto nuevo en Firestore");
      return;
    }

    const docRef = doc(this.firestore, 'coleccion_de_productos_nuevos', idDoc);

    try {
      await deleteDoc(docRef);
      console.log("✅ producto nuevo eliminado de la lista");
      // Limpiar selección de productos nuevos y el input
      this.listaProductosNuevos = [];
      this.inputNombreProductoNuevo = "";
    } catch (error) {
      console.error("❌ Error al eliminar producto nuevo:", error);
    }
  }
  

  filtrarListaDeProductosNuevos() {
    const termino = this.inputNombreProductoNuevo.toLowerCase().trim();
    console.log("Se llamó a filtrarListaDeProductosNuevos() en newproduct service");

    if (termino.length === 0) {
      console.log("🟡 Término vacío, vaciando descuentosFiltrados");
      this.listaProductosNuevosFiltrados = [];
      return;
    }

    const listaActual = this.productosNuevosSubject.value;
    this.listaProductosNuevosFiltrados = listaActual.filter(producto =>
        producto.nombre.toLowerCase().includes(termino)
    );
    console.log("🔹 productos nuevos Filtrados:", this.listaProductosNuevosFiltrados);
  }













}
