import { Component } from '@angular/core';
import {  FormsModule} from "@angular/forms";
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from '@angular/fire/firestore';
import {  Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import {  CommonModule,  NgOptimizedImage} from "@angular/common";
import {  ProductosService} from "../../service/productos-service";
import * as XLSX from 'xlsx'
import {  ColeccionesDeProductosService} from "../../service/colecciones-de-productos-service";
import {  MatFormField,  MatLabel} from "@angular/material/input";
import {  MatOption,  MatSelect} from "@angular/material/select";
import {  MatButton} from "@angular/material/button";
import { NewProductsService } from "../../service/new-products-service";
import {MatIconModule} from "@angular/material/icon";
import {VentanasAdm} from "./sub-components/ventanas-adm/ventanas-adm";
import {EditorProducto} from "./sub-components/editor-producto/editor-producto";
import { MatOptionModule } from '@angular/material/core';
import {EditorColecciones} from "./sub-components/editor-colecciones/editor-colecciones";
import {EditorNuevoProducto} from "./sub-components/editor-nuevo-producto/editor-nuevo-producto";
import {VentanaProductos} from "./sub-components/ventana-productos/ventana-productos";
import {AdminService} from "../../service/admin-service";


@Component({
  selector: 'app-admin-panel',
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    VentanasAdm,
    EditorProducto,
    EditorColecciones,
    EditorNuevoProducto,
    VentanaProductos,
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanelComponent {


  constructor(
      public productosService: ProductosService,
      public adminService: AdminService,
  ) {}

}

