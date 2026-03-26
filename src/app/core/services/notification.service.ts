import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Service de notifications toast pour MacSpace.
 * Centralise toutes les notifications de l'application.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  /**
   * Affiche une notification de succès.
   *
   * @param message Le message à afficher
   * @param titre Le titre de la notification
   */
  success(message: string, titre: string = 'Succès'): void {
    this.toastr.success(message, titre);
  }

  /**
   * Affiche une notification d'erreur.
   *
   * @param message Le message à afficher
   * @param titre Le titre de la notification
   */
  error(message: string, titre: string = 'Erreur'): void {
    this.toastr.error(message, titre);
  }

  /**
   * Affiche une notification d'avertissement.
   *
   * @param message Le message à afficher
   * @param titre Le titre de la notification
   */
  warning(message: string, titre: string = 'Attention'): void {
    this.toastr.warning(message, titre);
  }

  /**
   * Affiche une notification d'information.
   *
   * @param message Le message à afficher
   * @param titre Le titre de la notification
   */
  info(message: string, titre: string = 'Information'): void {
    this.toastr.info(message, titre);
  }
}