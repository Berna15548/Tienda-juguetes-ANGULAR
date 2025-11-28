import { Routes } from '@angular/router';
import { HomeComponent} from "./components/home-component/home-component";
import { AdminPanelComponent} from "./components/admin-panel/admin-panel";
import { TiendaProducto} from "./components/tienda-producto/tienda-producto";
import { Login} from "./components/login/login";
import { CartComponent} from "./share-components/cart-component/cart-component";
import { StoreComponent} from "./components/store-component/store-component";
import { authGuard} from "./guards/bloqueo-guard";
import { bloqueoTiendaProductoGuard} from "./guards/bloqueo-tienda-producto-guard";
import { CatalogosComponent } from "./components/catalogos-component/catalogos-component";
import { BigShopComponent } from "./components/big-shop-component/big-shop-component";


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'productos', component: StoreComponent },
    { path: 'login', component: Login },
    { path: 'cart', component: CartComponent },
    { path: 'catalogos', component: CatalogosComponent },
    {path: 'bigShop', component: BigShopComponent },
    {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [authGuard] 
    },
    { 
        path: 'tienda-producto',
        component: TiendaProducto,
        canActivate: [bloqueoTiendaProductoGuard]
    },

];
