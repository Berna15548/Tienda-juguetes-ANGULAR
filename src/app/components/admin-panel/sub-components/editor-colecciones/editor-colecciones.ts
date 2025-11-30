import { Component } from '@angular/core';
import {AdminService} from "../../../../service/admin-service";
import {ColeccionesDeProductosService} from "../../../../service/colecciones-de-productos-service";
import {ProductosService} from "../../../../service/productos-service";
import { CommonModule } from '@angular/common';
import {MatOptionModule} from "@angular/material/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-editor-colecciones',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        FormsModule,
        NgOptimizedImage,

    ],
  templateUrl: './editor-colecciones.html',
    styleUrl: '../../admin-panel.scss',
})
export class EditorColecciones {

  constructor(public adminService: AdminService, 
              public coleccionesService: ColeccionesDeProductosService,
              public productosService: ProductosService,
              ) {}

  
  
}
