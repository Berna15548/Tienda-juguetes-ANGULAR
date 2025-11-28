import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService} from "../service/auth-service"; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario está logueado, deja pasar
  if (authService.currentUser) {
    return true;
  } else {
    return router.parseUrl('/'); // Redirige a la ruta raíz
  }
};
