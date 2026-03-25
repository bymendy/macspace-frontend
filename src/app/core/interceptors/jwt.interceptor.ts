import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Intercepteur HTTP pour la gestion du token JWT dans MacSpace.
 * Ajoute automatiquement le token JWT dans le header Authorization
 * de chaque requête HTTP sortante.
 * Gère également les erreurs d'authentification (401, 403).
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  /**
   * Intercepte chaque requête HTTP et ajoute le token JWT si disponible.
   * Redirige vers la page de login en cas d'erreur 401 ou 403.
   *
   * @param request La requête HTTP originale
   * @param next Le handler suivant dans la chaîne
   * @returns Observable de l'événement HTTP
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    /* Récupération du token depuis le localStorage */
    const token = localStorage.getItem('access_token');

    /* Ajout du token JWT dans le header Authorization si présent */
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        /* Redirection vers login en cas d'erreur d'authentification */
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('id_entreprise');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}