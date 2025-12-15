import { Component } from '@angular/core';
import {  FormsModule} from "@angular/forms";
import {  CommonModule} from "@angular/common";
import {  ProductosService} from "../../service/productos-service";
import {MatIconModule} from "@angular/material/icon";
import {VentanasAdm} from "./sub-components/ventanas-adm/ventanas-adm";
import {EditorProducto} from "./sub-components/editor-producto/editor-producto";
import {EditorColecciones} from "./sub-components/editor-colecciones/editor-colecciones";
import {EditorNuevoProducto} from "./sub-components/editor-nuevo-producto/editor-nuevo-producto";
import {VentanaProductos} from "./sub-components/ventana-productos/ventana-productos";
import {AdminService} from "../../service/admin-service";
import {SubirProducto} from "./sub-components/subir-producto/subir-producto";


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
    SubirProducto,
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

