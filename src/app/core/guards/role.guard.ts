import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: UserRole[] = route.data['roles'] ?? [];
  const user = authService.currentUser();

  if (!user) return router.createUrlTree(['/login']);
  if (allowedRoles.length === 0) return true;
  if (allowedRoles.includes(user.role)) return true;

  return router.createUrlTree(['/app/dashboard']);
};
