import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../shared/services/ticket.service';
import { DataService } from '../../shared/services/data.service';
import { Participation, TicketWithEvent } from '../../models/participation';
import { Event } from '../../models/event';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  tickets: TicketWithEvent[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getUserTickets().subscribe({
      next: (participations: Participation[]) => {
        // Charger les détails de chaque événement
        const ticketPromises = participations.map(participation => 
          this.dataService.getEventByIdFromBackend(participation.eventId).toPromise()
            .then(event => ({
              ...participation,
              event: event ? {
                id: event.id,
                title: event.title,
                date: typeof event.date === 'string' ? event.date : new Date(event.date).toISOString().split('T')[0],
                place: event.place,
                price: event.price,
                imageUrl: event.imageUrl
              } : undefined
            }))
            .catch(() => ({
              ...participation,
              event: undefined
            }))
        );

        Promise.all(ticketPromises).then(tickets => {
          this.tickets = tickets;
          this.isLoading = false;
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tickets:', error);
        this.errorMessage = 'Erreur lors du chargement de vos tickets';
        this.isLoading = false;
      }
    });
  }

  cancelTicket(ticket: TicketWithEvent): void {
    if (!ticket.id) {
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir annuler ce ticket ?')) {
      return;
    }

    this.ticketService.cancelTicket(ticket.id).subscribe({
      next: () => {
        alert('Ticket annulé avec succès');
        this.loadTickets();
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation:', error);
        alert('Erreur lors de l\'annulation du ticket');
      }
    });
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Inconnu';
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmé';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'badge bg-secondary';
    switch (status) {
      case 'CONFIRMED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'CANCELLED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateTotal(event: TicketWithEvent['event'] | undefined, nbPlaces: number): number {
    if (!event || !event.price) return 0;
    return event.price * nbPlaces;
  }
}

