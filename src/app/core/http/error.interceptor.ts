import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 403) {
        snackBar.open('Accès refusé', 'Fermer', { duration: 4000, panelClass: 'snack-error' });
      } else if (error.status >= 500) {
        snackBar.open('Erreur serveur, veuillez réessayer', 'Fermer', {
          duration: 4000,
          panelClass: 'snack-error',
        });
      }
      return throwError(() => error);
    }),
  );
};
