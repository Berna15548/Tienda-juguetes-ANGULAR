import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  Producto,} from "../../interfaces/interfaces";
import {    RouterLink} from "@angular/router";
import { ProductosService } from "../../service/productos-service";

@Component({
  selector: 'app-product-card',
  standalone: true,
    imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCard {
  @Input() producto!: Producto;

  constructor(public productosService: ProductosService) { }

  
  
  
  

}