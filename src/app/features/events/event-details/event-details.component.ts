import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  id!: number;
  eventDetails!: Event;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private actRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params["id"];
    this.loadEventDetails();
  }

  loadEventDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.dataService.getEventByIdFromBackend(this.id).subscribe({
      next: (response) => {
        this.eventDetails = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
        this.errorMessage = 'Erreur lors du chargement de l\'événement.';
        this.isLoading = false;
      }
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  dateExpired(): boolean {
    if (!this.eventDetails?.date) return false;
    const eventDate = typeof this.eventDetails.date === 'string' 
      ? new Date(this.eventDetails.date) 
      : this.eventDetails.date;
    return eventDate < new Date();
  }

  goToReservation(): void {
    if (this.eventDetails) {
      this.router.navigate(['/events/participate', this.eventDetails.id, this.eventDetails.price]);
    }
  }

  likeEvent(): void {
    if (!this.eventDetails) return;
    // Incrémenter les likes localement
    this.eventDetails.nbLikes++;
    // TODO: Mettre à jour le backend si nécessaire
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}
