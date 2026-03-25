import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

/**
 * Configuration des routes du module d'authentification MacSpace.
 */
const routes: Routes = [
  {
    /* Route par défaut - redirection vers login */
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    /* Page de connexion */
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}