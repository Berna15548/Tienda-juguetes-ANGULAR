import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ItemCarrito {
  id_producto: string;
  unidades: number;
}

@Injectable({ providedIn: 'root' })
export class Compras {
  private readonly KEY = 'carrito';
  private carritoSubject: BehaviorSubject<ItemCarrito[]>;

  constructor() {
    const stored = localStorage.getItem(this.KEY);
    const inicial: ItemCarrito[] = stored ? JSON.parse(stored) : [];
    this.carritoSubject = new BehaviorSubject<ItemCarrito[]>(inicial);
  }

  // Observable para usar con async pipe
  get carrito$(): Observable<ItemCarrito[]> {
    return this.carritoSubject.asObservable();
  }

  // Getter directo
  getCarrito(): ItemCarrito[] {
    return this.carritoSubject.value;
  }

  private actualizarCarrito(nuevoCarrito: ItemCarrito[]): void {
    this.carritoSubject.next(nuevoCarrito);
    localStorage.setItem(this.KEY, JSON.stringify(nuevoCarrito));
  }

  agregarProducto(id_producto: string, unidades: number): void {
    const carrito = this.getCarrito();
    const index = carrito.findIndex(item => item.id_producto === id_producto);

    if (index >= 0) {
      carrito[index].unidades += unidades;
    } else {
      carrito.push({ id_producto, unidades });
    }

    this.actualizarCarrito([...carrito]);
  }

  actualizarUnidades(id_producto: string, nuevasUnidades: number): void {
    const carrito = this.getCarrito();
    const index = carrito.findIndex(item => item.id_producto === id_producto);

    if (index >= 0) {
      carrito[index].unidades = nuevasUnidades;
      this.actualizarCarrito([...carrito]);
    }
  }

  eliminarProducto(id_producto: string): void {
    const carrito = this.getCarrito().filter(item => item.id_producto !== id_producto);
    this.actualizarCarrito(carrito);
  }

  vaciarCarrito(): void {
    localStorage.removeItem(this.KEY);
    this.carritoSubject.next([]);
    
    this.actualizarCarrito([]); // esto elimina el registro en localstorage
  }
}
