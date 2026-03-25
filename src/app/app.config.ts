import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

/**
 * Configuration principale de l'application MacSpace.
 * Enregistre les providers globaux :
 * - Router avec les routes de l'application
 * - HttpClient avec l'intercepteur JWT
 * - Animations Angular Material
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /* Configuration du router */
    provideRouter(routes),

    /* Configuration du HttpClient avec support des intercepteurs */
    provideHttpClient(withInterceptorsFromDi()),

    /* Enregistrement de l'intercepteur JWT */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },

    /* Activation des animations Angular Material */
    provideAnimations()
  ]
};