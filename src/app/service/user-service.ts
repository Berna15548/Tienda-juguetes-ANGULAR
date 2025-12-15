import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { AuthService} from "./auth-service";
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})


export class UserService {
  
  constructor(
      private firestore: Firestore,
      private authService: AuthService
  ) {}

  private get currentUser(): User | null {
    return this.authService.currentUser;
  }

  async guardarDatosUsuario(datos: any): Promise<void> {
    const user = this.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    const userRef = doc(this.firestore, 'usuarios', user.uid);
    await setDoc(userRef, datos, { merge: true });
  }

  async obtenerDatosUsuario(): Promise<any | null> {
    const user = this.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    const userRef = doc(this.firestore, 'usuarios', user.uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
}
