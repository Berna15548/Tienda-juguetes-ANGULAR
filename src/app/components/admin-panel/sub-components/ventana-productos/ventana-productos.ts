import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AdminService} from "../../../../service/admin-service";
import {FormsModule} from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import {ProductosService} from "../../../../service/productos-service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-ventana-productos',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatIcon,
        MatButton
    ],
  templateUrl: './ventana-productos.html',
  styleUrl: '../../admin-panel.scss',
})
export class VentanaProductos {

  constructor(public adminService: AdminService, public productosService: ProductosService) {
  }
}
