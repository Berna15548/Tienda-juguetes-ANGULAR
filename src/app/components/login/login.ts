import { Component,ViewChild } from '@angular/core';
import {  TopBar } from "../../share-components/top-bar/top-bar";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel
} from "@angular/material/input";
import {  MatButton} from "@angular/material/button";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  Auth,
  signOut
} from '@angular/fire/auth';
import {
  doc,
  Firestore,
  setDoc,
} from "@angular/fire/firestore";
import {
  AsyncPipe,
  NgClass
} from "@angular/common";
import {  MatTooltip} from "@angular/material/tooltip";
import { Router} from "@angular/router";
import {  AuthService} from "../../service/auth-service";
import { DatosUsuario} from "../../interfaces/interfaces";

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    FormsModule,
    NgClass,
    MatTooltip,
    AsyncPipe,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})


export class Login {
  @ViewChild('tooltipRef') tooltipRef!: MatTooltip;
  loginForm: FormGroup;
  registrationForm: FormGroup;
  mostrarFormularioRegistro: boolean = false;
  tooltipMessage: string = "";

  constructor(private fb: FormBuilder, 
              public auth: Auth,
              private firestore: Firestore,
              private router: Router,
              public authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  async login() {
    console.log("se llamo a login()");
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email.trim().toLowerCase();
    const password = this.loginForm.value.password;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario logueado:', userCredential.user.email);
      this.tooltipMessage = "Usuario logueado"; /*el estado de logueado se almacena en localstorage*/
      this.tooltipRef.show();
      setTimeout(() => this.tooltipRef.hide(), 3000);

      await this.router.navigate(['/admin']);

    } catch (err: any) {
        console.dir(err);  // Esto ayuda a inspeccionar
        const code = err?.code;

        if (code === 'auth/invalid-credential') {
          this.tooltipMessage = "Usuario o contraseña incorrectos";
        } else if (code === 'auth/user-not-found') {
          this.tooltipMessage = "Usuario no encontrado";
        } else if (code === 'auth/wrong-password') {
          this.tooltipMessage = "Contraseña incorrecta";
        } else {
          this.tooltipMessage = "Error desconocido";
        }

        this.tooltipRef.show();
        setTimeout(() => this.tooltipRef.hide(), 3000);
      }


  }

  registrarse() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const email = this.registrationForm.value.email.trim().toLowerCase();
    const password = this.registrationForm.value.password;

    createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log('Usuario creado:', user.email);

          // 🔻 Crear documento Firestore con los campos iniciales
          const nuevoUsuario: DatosUsuario = {
            mail_usuario: user.email || '',
            compras_realizadas: []
          };

          const usuarioRef = doc(this.firestore, 'usuarios', user.uid);
          await setDoc(usuarioRef, nuevoUsuario);

          this.mostrarFormularioRegistro = false;
        })
        .catch((err: any) => {
          console.error('Error creando usuario:', err.code, err.message);
        });
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('usuarioLogueado');
      this.tooltipMessage = "Sesión cerrada"; 
      this.tooltipRef.show();
      setTimeout(() => this.tooltipRef.hide(), 5000);

      console.log("Usuario deslogueado correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

    }
  }




}
