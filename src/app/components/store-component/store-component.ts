import { Component, OnInit} from '@angular/core';
import ColeccionesDeProductosService from "../../service/colecciones-de-productos-service";
import { ProductosService} from "../../service/productos-service";
import {    productCollectionCard,} from "../../interfaces/interfaces";
import {    AsyncPipe,    DecimalPipe,    NgStyle} from "@angular/common";
import { MatButton} from "@angular/material/button";
import {    CatalogosService} from "../../service/catalogos-service";
import {    RouterLink} from "@angular/router";
import {
    ProductCard
} from "../../share-components/product-card/product-card";


@Component({
  selector: 'app-products-component',
    imports: [
        NgStyle,
        MatButton,
        AsyncPipe,
        RouterLink,
        ProductCard,
    ],
  templateUrl: './store-component.html',
  styleUrl: './store-component.scss'
})
export class StoreComponent implements OnInit {
    coleccion: productCollectionCard[] = [];

    constructor(
        public productosService: ProductosService,
        public coleccionService: ColeccionesDeProductosService,
        public catalogosService: CatalogosService,
    ) { }

    ngOnInit() {
        this.coleccionService.coleccionDeProductos$.subscribe({
            next: data => {
                this.coleccion = data;
            }
        });
    }

    protected readonly CatalogosService = CatalogosService;
    protected readonly ProductosService = ProductosService;
}
