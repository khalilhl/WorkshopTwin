import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../shared/services/ticket.service';
import { DataService } from '../../../shared/services/data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrl: './participation-form.component.css',
})
export class ParticipationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  eventId!: number;
  event!: Event | null;
  isLoading: boolean = false;
  isLoadingEvent: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.reservationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nbPlaces: ['', [Validators.required, Validators.min(1), Validators.pattern('^[1-9][0-9]*$')]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis la route
    this.eventId = Number(this.activatedRoute.snapshot.params['id']);
    
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Pré-remplir l'email avec celui de l'utilisateur connecté
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.email) {
      this.reservationForm.patchValue({
        email: currentUser.email
      });
    }

    // Charger les détails de l'événement
    this.loadEventDetails();
  }

  loadEventDetails(): void {
    this.isLoadingEvent = true;
    this.dataService.getEventByIdFromBackend(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoadingEvent = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
        this.errorMessage = 'Erreur lors du chargement de l\'événement';
        this.isLoadingEvent = false;
      }
    });
  }

  get email() {
    return this.reservationForm.get('email');
  }

  get nbPlaces() {
    return this.reservationForm.get('nbPlaces');
  }

  calculateTotal(): number {
    if (!this.event || !this.nbPlaces?.value) {
      return 0;
    }
    const nbPlacesValue = Number(this.nbPlaces.value);
    return this.event.price * nbPlacesValue;
  }

  getMaxPlaces(): number {
    return this.event?.nbPlaces || 0;
  }

  onSubmit(): void {
    if (this.reservationForm.invalid || !this.event) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.reservationForm.value;
    const nbPlacesValue = Number(formValue.nbPlaces);

    // Vérifier les places disponibles
    if (this.event.nbPlaces < nbPlacesValue) {
      this.errorMessage = `Pas assez de places disponibles. Places disponibles : ${this.event.nbPlaces}`;
      this.isLoading = false;
      return;
    }

    this.ticketService.buyTicket(this.eventId, formValue.email, nbPlacesValue).subscribe({
      next: (participation) => {
        this.isLoading = false;
        this.successMessage = `Ticket réservé avec succès ! ${nbPlacesValue} place(s) réservée(s).`;
        
        // Rediriger vers la page des tickets après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/tickets']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Erreur lors de la réservation. Veuillez réessayer.';
        console.error('Erreur lors de la réservation:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
