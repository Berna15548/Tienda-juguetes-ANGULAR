import {
  CanActivateFn,
  Router
} from '@angular/router';
import { ProductosService} from "../service/productos-service";
import {
  inject
} from "@angular/core";


export const bloqueoTiendaProductoGuard: CanActivateFn = (route, state) => {
  const seleccionProducto = inject(ProductosService)
  const router = inject(Router);
  if (seleccionProducto.productoEnPantalla!==null) {
    return true;
  } else {
    return router.parseUrl('/'); 
  }
};
