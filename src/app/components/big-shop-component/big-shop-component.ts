import { Component, OnInit } from '@angular/core';
import { NewProductsService } from "../../service/new-products-service";
import {    AsyncPipe} from "@angular/common";
import { ProductosService } from "../../service/productos-service";
import { ProductCard } from "../../share-components/product-card/product-card";

@Component({
    selector: 'app-big-shop-component',
    templateUrl: './big-shop-component.html',
    imports: [
        AsyncPipe,
        ProductCard
    ],
    styleUrls: ['./big-shop-component.scss'] // <- corregido
})
export class BigShopComponent implements OnInit { // <- IMPLEMENTA OnInit

    // Variable opcional si querés suscribirte
    productosNuevos: any[] = [];

    constructor(public newProductsService: NewProductsService, 
                public productosService: ProductosService,
                ) 
    {}

    ngOnInit() {
        // Suscribirse al BehaviorSubject para tener un array local (opcional)
        this.newProductsService.coleccionProductosNuevosSubject$.subscribe(
            productos => this.productosNuevos = productos
        );
    }
}
