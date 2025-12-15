import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth-service';
import {
  DatosUsuario,
  Producto
} from "../interfaces/interfaces";
import { onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { ProductosService} from "./productos-service";

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private usuario: User | null = null;
  private datosUsuarioSubject = new BehaviorSubject<DatosUsuario | null>(null);
  datosUsuario$ = this.datosUsuarioSubject.asObservable();
  carrito: { producto: Producto; unidades: number }[] = [];
  mostrarModalLoginRequerido: boolean = false;



  constructor(
      private firestore: Firestore,
      private authService: AuthService,
      private productosService: ProductosService,
      ) {
    this.escucharCambioDeUsuario(); 
  }
  
  private escucharCambioDeUsuario() {
    const auth = this.authService.auth;
    onAuthStateChanged(auth, async (user) => {
      this.usuario = user;
      if (user) {
        const datos = await this.cargarDatosUsuario(user.uid);
        this.datosUsuarioSubject.next(datos);
      } else {
        this.datosUsuarioSubject.next(null);
      }
    });
  }

  private async cargarDatosUsuario(uid: string): Promise<DatosUsuario | null> {
    const ref = doc(this.firestore, 'usuarios', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DatosUsuario) : null;
  }
  
  get usuarioDocRef() {
    return doc(this.firestore, 'usuarios', this.usuario!.uid);
  }

  // Método para sincronizar carrito local con Firestore
  async sincronizarCarrito() {
    // Convertir carrito local a la estructura que guarda Firestore
    const carritoParaFirestore = this.carrito.map(item => ({
      id_producto: item.producto.id,
      cantidad_producto: item.unidades,
      valor_total: (item.producto.precio || 0) * item.unidades
    }));

    await updateDoc(this.usuarioDocRef, {
      carrito_de_compras: carritoParaFirestore
    });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

}
