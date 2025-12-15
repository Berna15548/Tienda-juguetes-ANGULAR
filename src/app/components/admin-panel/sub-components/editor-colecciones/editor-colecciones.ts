import { Component } from '@angular/core';
import {AdminService} from "../../../../service/admin-service";
import ColeccionesDeProductosService from "../../../../service/colecciones-de-productos-service";
import {ProductosService} from "../../../../service/productos-service";
import { CommonModule } from '@angular/common';
import {MatOptionModule} from "@angular/material/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCardTitle} from "@angular/material/card";
import {MatCardHeader} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatCardContent} from "@angular/material/card";

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
        MatButton,
        MatCard,
        MatIcon,
        MatCardTitle,
        MatCardHeader,
        MatDivider,
        MatCardContent,

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
