import { Component } from '@angular/core';
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardImage
} from '@angular/material/card';
import { NgClass } from '@angular/common';
import { ProductosService } from '../../service/productos-service';
import { ComprasService } from '../../service/compras-service';
import { MatButton } from '@angular/material/button';
import { Compras, ItemCarrito } from '../../service/compras';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-tienda-producto',
    templateUrl: './tienda-producto.html',
    styleUrls: ['./tienda-producto.scss'],
    standalone: true,
    imports: [
        MatCardContent,
        MatCard,
        MatCardImage,
        NgClass,
        MatCardActions,
        MatButton,
    ],
})
export class TiendaProducto {
    carrito$!: Observable<ItemCarrito[]>;
    
    constructor(
        public productosService: ProductosService,
        public comprasService: ComprasService, // solo si usás Firebase para pedidos
        public comprasLocalStorage: Compras // nuestro carrito real
    ) {
        this.carrito$ = this.comprasLocalStorage.carrito$;
    }

    agregarProductoAlCarrito(): void {
        console.log("se llamo a agregarProductoAlCarrito")
        const producto = this.productosService.productoEnPantalla;
        if (producto && producto.id) {
            this.comprasLocalStorage.agregarProducto(producto.id, 1); // agrega 1 unidad
        } else {
            console.warn('❌ No hay producto válido en pantalla');
        }
    }
}