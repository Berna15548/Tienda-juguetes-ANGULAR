import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ProductosService} from "../../../../service/productos-service";
import {AdminService} from "../../../../service/admin-service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-editor-nuevo-producto',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './editor-nuevo-producto.html',
  styleUrl: '../../admin-panel.scss',
})
export class EditorNuevoProducto {

  constructor(public adminService: AdminService, public productosService: ProductosService) {
  }
  
}
