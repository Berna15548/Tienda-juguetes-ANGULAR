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
    styleUrls: ['./big-shop-component.scss'] 
})
export class BigShopComponent implements OnInit { 
    
    productosNuevos: any[] = [];

    constructor(public newProductsService: NewProductsService, 
                public productosService: ProductosService,
                ) 
    {}

    ngOnInit() {
        this.newProductsService.coleccionProductosNuevosSubject$.subscribe(
            productos => this.productosNuevos = productos
        );
    }
}
