import {
    Component,
    OnInit,
} from '@angular/core';
import {
    MatList,
    MatListItem
} from '@angular/material/list';
import {
    MatButton,
    MatButtonModule
} from '@angular/material/button';
import {    FormsModule} from "@angular/forms";
import {ProductosService} from "../../service/productos-service";
import { Compras} from "../../service/compras";
import { Producto } from "../../interfaces/interfaces";
import {
    CurrencyPipe
} from "@angular/common";
import { AuthService} from "../../service/auth-service";
import {
    MatDialog,
    MatDialogModule
} from "@angular/material/dialog";
import {
    doc,
    getFirestore,
    updateDoc,
    arrayUnion
} from "@angular/fire/firestore";
import {
    Subscription
} from "rxjs";

@Component({
    selector: 'app-cart-component',
    standalone: true,
    imports: [
        MatList,
        MatListItem,
        FormsModule,
        MatButton,
        CurrencyPipe,
        MatDialogModule,
        MatButtonModule,
    ],
    templateUrl: './cart-component.html',
    styleUrl: './cart-component.scss'
})
export class CartComponent implements OnInit{
    carritoCompleto: { producto: Producto; unidades: number }[] = [];
    totalCompra: number = 0;
    private subs = new Subscription();

    constructor(
        private comprasLocal: Compras,
        public productosService: ProductosService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.subs.add(
            this.comprasLocal.carrito$.subscribe(items => {
                this.carritoCompleto = items
                    .map(item => {
                        const producto = this.productosService.getProductoPorId(item.id_producto);
                        return producto ? { producto, unidades: item.unidades } : null;
                    })
                    .filter((item): item is { producto: Producto; unidades: number } => item !== null);

                this.recalcularTotal();
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    
    actualizarYSincronizar() {
        this.carritoCompleto.forEach(item => {
            this.comprasLocal.actualizarUnidades(item.producto.id, item.unidades);
        });
        this.recalcularTotal();
    }

    cancelarCompra(item: { producto: Producto; unidades: number }) {
        this.comprasLocal.eliminarProducto(item.producto.id);
    }

    async comprar() {
        const user = this.authService.currentUser
        const firestore = getFirestore();
        //alerta por si el usuario no esta logeado
        if (!user) {
            alert('Debes estar logueado para comprar.');
            return;
        }

        // 🔧 Convertir carritoCompleto en datos aptos para Firestore
        const productos = this.carritoCompleto.map(item => ({
            ...item.producto, // Copia todas las propiedades del producto
            unidades: item.unidades // Le agrega las unidades compradas
        }));

        const compra = {
            fecha: new Date().toISOString(),
            productos,
            monto_total: this.totalCompra
        };

        try {
            const ref = doc(firestore, 'usuarios', user.uid);
            await updateDoc(ref, {
                compras_realizadas: arrayUnion(compra)
            });

            alert('Producto comprado! (es broma)');
            this.comprasLocal.vaciarCarrito();

        } catch (err) {
            console.error('Error al guardar la compra:', err);
            alert('Ocurrió un error al guardar la compra.');
        }
    }

    private recalcularTotal() {
        this.totalCompra = this.carritoCompleto.reduce((acc, item) =>
            acc + item.producto.precio * item.unidades, 0);
    }
    
    

}
