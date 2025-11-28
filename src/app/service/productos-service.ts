import { Injectable } from '@angular/core';
import { Producto} from "../interfaces/interfaces";
import {
  Firestore,
  collectionData,
  collection,
  addDoc
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ProductosService {
  verCarrito: boolean = false; // esto es solo para visualizar o no el componete carrito

  private trendProducts = new BehaviorSubject<Producto[]>([]);
  public trendProducts$ = this.trendProducts.asObservable();

  public productosFiltrados: Producto[] = [];
  public productosFiltradosParaNuevoProductos: Producto[] = [];
  public productosSeleccionados: Producto[] = [];
  public searchTerm: string = '';
  public buscadorNuevosProductosService: string = ''; // es el searcjTerm de nuevos prodcutos
  public productoEnPantalla: Producto | null = null;
  public mostrarTodosProductos: boolean = false;

 

  constructor(private firestore: Firestore) {
    this.getProductos().subscribe({

      next: productos => {
        console.log('🟢 Productos recibidos desde Firebase:', productos);
        
        this.trendProducts.next(productos);
        productos.forEach(p => (p.seleccionado = false));
        this.filtrarProductos();
      },
      error: err => {
        console.error('❌ Error al obtener productos desde Firebase:', err);
      }
    });
  }

  getProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  agregarArchivoDeProductos(p: Producto) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, p);
  }
  
  filtrarProductos() {
    const termino = this.searchTerm.toLowerCase().trim();
    console.log("🔍 Se llamó a filtrarProductos(), searchTerm:", this.searchTerm);
    
    //  Deseleccionar los que ya no están en productosFiltrados
    this.productosSeleccionados = this.productosSeleccionados.filter(p => {
      const sigueEstando = this.productosFiltrados.includes(p);
      if (!sigueEstando) p.seleccionado = false;
      return sigueEstando;
    });

    // Mostrar todo si está activado el checkbox
    if (this.mostrarTodosProductos) {
      console.log("📦 mostrarTodosProductos activado, mostrando todo");
      this.productosFiltrados = this.trendProducts.value;

      this.searchTerm = "" /*limpia la barra de busqueda*/
      return;
    }

    // 🟡 Si no hay término, vacía el array filtrado
    if (termino.length === 0) {
      console.log("🟡 Término vacío y checkbox desactivado, vaciando productosFiltrados");
      this.productosFiltrados = [];
      return;
    }

    this.productosFiltrados = this.trendProducts.value.filter(producto =>
        producto.nombre.toLowerCase().includes(termino)
    );

    console.log("✅ Productos filtrados:", this.productosFiltrados);
  }
  
  filtrarProductosParaNuevosProductosService() {
    const termino = this.buscadorNuevosProductosService.toLowerCase().trim();
    console.log("🔍 Se llamó a filtrarProductosParaNuevosProductosService() en productos service");

    // 🟡 Si no hay término, vacía el array filtrado
    if (termino.length === 0) {
      console.log("🟡 Término vacío, vaciando productosFiltradosParaNuevosProductos");
      this.productosFiltradosParaNuevoProductos = [];
      return;
    }
    // Y aca pasa los productos que coincidan con el termino a la lista productosFiltradosParaNuevosProductos
    this.productosFiltradosParaNuevoProductos = this.trendProducts.value.filter(producto =>
        producto.nombre.toLowerCase().includes(termino)
    );

  }

  toggleSeleccion(p: Producto, seleccionado: boolean) {
    if (seleccionado) {
      if (!this.productosSeleccionados.includes(p)) {
        this.productosSeleccionados.push(p);
      }
    } else {
      this.productosSeleccionados = this.productosSeleccionados.filter(prod => prod !== p);
    }
  }

  seleccionarProducto(producto: Producto) {
    console.log('Seleccionado:', producto);
    this.productoEnPantalla = producto;
  }

  getProductoPorId(id: string): Producto | undefined {
    return this.trendProducts.value.find(p => p.id === id);
  }










}
