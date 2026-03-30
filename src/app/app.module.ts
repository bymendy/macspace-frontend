import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/* Ionic Angular — nécessaire pour ion-app, ion-menu, ion-router-outlet */
import { IonicModule } from '@ionic/angular';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { SharedModule } from './shared/shared.module';

/**
 * Module racine de l'application MacSpace.
 * Intègre Ionic pour le support mobile (menu, navigation, composants natifs).
 */
@NgModule({
  declarations: [
    AppComponent  // Composant racine de l'application
  ],
  imports: [
    BrowserModule,            // Module de base Angular pour le navigateur
    BrowserAnimationsModule,  // Support des animations Angular
    HttpClientModule,         // Client HTTP pour les appels API backend

    /* Ionic — initialisation avec routingEnabled pour Angular Router */
    IonicModule.forRoot({
      mode: 'md',             // Mode Material Design (cohérent Android + iOS)
      animated: true          // Animations Ionic activées
    }),

    /* Angular Router — gestion des routes de l'application */
    RouterModule.forRoot(routes),

    /* Module partagé — composants réutilisables (sidebar, header...) */
    SharedModule,

    /* Configuration des notifications toast */
    ToastrModule.forRoot({
      timeOut: 3000,                        // Durée d'affichage : 3 secondes
      positionClass: 'toast-bottom-right',  // Position en bas à droite
      preventDuplicates: true,              // Évite les doublons
      progressBar: true,                    // Barre de progression
      closeButton: true                     // Bouton de fermeture
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,  // Intercepteur HTTP pour JWT
      useClass: JwtInterceptor,    // Ajoute le token JWT à chaque requête
      multi: true                  // Permet plusieurs intercepteurs
    }
  ],
  bootstrap: [AppComponent]  // Composant de démarrage de l'application
})
export class AppModule {}