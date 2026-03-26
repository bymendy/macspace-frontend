import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Client } from '../../../shared/models/client';

/**
 * Composant formulaire de création et modification d'un client MacSpace.
 */
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  /** Formulaire client */
  clientForm: FormGroup;

  /** Indicateur de chargement */
  isLoading = false;

  /** Indicateur de modification */
  isEditMode = false;

  /** Identifiant du client en modification */
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
/* Initialisation du formulaire */
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      numTel: [''],
      adresse: this.fb.group({
        adresse1: ['', [Validators.required]],
        adresse2: [''],
        ville: ['', [Validators.required]],
        codePostal: ['', [Validators.required]],
        pays: ['France']
      })
    });
  }
  /**
   * Vérifie si on est en mode modification et charge le client.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.clientId = Number(id);
      this.isEditMode = true;
      this.loadClient(this.clientId);
    }
  }
  /**
   * Charge un client existant pour modification.
   *
   * @param id L'identifiant du client
   */
  loadClient(id: number): void {
    this.isLoading = true;
    this.clientService.findById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue(client);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du client.');
        this.isLoading = false;
      }
    });
  }
  /**
   * Soumet le formulaire pour créer ou modifier un client.
   */
  onSubmit(): void {
    if (this.clientForm.invalid) return;

    this.isLoading = true;

    const client: Client = {
      ...this.clientForm.value,
      idEntreprise: Number(localStorage.getItem('id_entreprise'))
    };

    /* Ajout de l'id uniquement en mode modification */
    if (this.isEditMode && this.clientId) {
      client.id = this.clientId;
    }

    this.clientService.save(client).subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditMode ? 'Client modifié avec succès.' : 'Client créé avec succès.'
        );
        this.router.navigate(['/clients']);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la sauvegarde du client.');
        this.isLoading = false;
      }
    });
  }
  /**
   * Annule et retourne à la liste des clients.
   */
  annuler(): void {
    this.router.navigate(['/clients']);
  }
}