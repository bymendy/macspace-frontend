import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Point d'entrée principal de l'application MacSpace.
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));