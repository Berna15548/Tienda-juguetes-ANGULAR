import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ProductosService} from "../../../../service/productos-service";
import {AdminService} from "../../../../service/admin-service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatLabel} from "@angular/material/form-field";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDivider} from "@angular/material/divider";
import {MatCardContent} from "@angular/material/card";
import {MatCardTitle} from "@angular/material/card";
import {MatCardHeader} from "@angular/material/card";

@Component({
  selector: 'app-editor-nuevo-producto',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCard,
    MatButton,
    MatIcon,
    MatLabel,
    MatFormField,
    MatInput,
    MatDivider,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
  ],
  templateUrl: './editor-nuevo-producto.html',
  styleUrl: '../../admin-panel.scss',
})
export class EditorNuevoProducto {

  constructor(public adminService: AdminService, public productosService: ProductosService) {
  }
  
}
