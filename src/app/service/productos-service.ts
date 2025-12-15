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
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ProductosService {
  verCarrito: boolean = false; 

  private trendProducts = new BehaviorSubject<Producto[]>([]);
  public trendProducts$ = this.trendProducts.asObservable();

  public productosFiltrados: Producto[] = [];
  public productosFiltradosParaNuevoProductos: Producto[] = [];
  public productosSeleccionados: Producto[] = [];
  public searchTerm: string = '';
  public buscadorNuevosProductosService: string = '';
  public productoEnPantalla: Producto | null = null;
  public mostrarTodosProductos: boolean = false;


  constructor(private firestore: Firestore) {
    this.getProductos().subscribe({

      next: productos => {
        
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
    
    //  Deseleccionar los que ya no están en productosFiltrados
    this.productosSeleccionados = this.productosSeleccionados.filter(p => {
      const sigueEstando = this.productosFiltrados.includes(p);
      if (!sigueEstando) p.seleccionado = false;
      return sigueEstando;
    });

    // Mostrar todo si está activado el checkbox
    if (this.mostrarTodosProductos) {
      this.productosFiltrados = this.trendProducts.value;

      this.searchTerm = "" 
      return;
    }

  
    if (termino.length === 0) {
      this.productosFiltrados = [];
      return;
    }

    this.productosFiltrados = this.trendProducts.value.filter(producto =>
        producto.nombre.toLowerCase().includes(termino)
    );

  }
  
  filtrarProductosParaNuevosProductosService() {
    const termino = this.buscadorNuevosProductosService.toLowerCase().trim();

    if (termino.length === 0) {
      this.productosFiltradosParaNuevoProductos = [];
      return;
    }
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
    this.productoEnPantalla = producto;
  }

  getProductoPorId(id: string): Producto | undefined {
    return this.trendProducts.value.find(p => p.id === id);
  }



  public productosConDescuento$: Observable<Producto[]> = this.trendProducts$.pipe(
      map(productos => productos.filter(p => p.descuento > 0))
  );








}
