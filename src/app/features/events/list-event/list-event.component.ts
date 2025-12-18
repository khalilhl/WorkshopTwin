import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../../../models/event';
import { DataService } from '../../../shared/services/data.service';
import { TicketService } from '../../../shared/services/ticket.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css',
})
export class ListEventComponent {
  searchItem: string = '';
  eventList: Event[] = [];
  filteredList: Event[] = [];
  
  constructor(
    private data: DataService,
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.data.getAllEventsFromBacked().subscribe({
      next: (res) => {
        this.eventList = res;
        this.filteredList = res;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements:', error);
      }
    });
  }

  incLikes(event: Event) {
    event.nbLikes++;
    // TODO: Mettre à jour le backend si nécessaire
  }

  buy(event: Event) {
    // Rediriger vers la page de réservation
    this.router.navigate(['/events/participate', event.id, event.price]);
  }

  dateExpire(event: Event) {
    return new Date(event.date) < new Date();
  }

  filter() {
    if (!this.searchItem || this.searchItem.trim() === '') {
      return this.eventList;
    }
    
    const searchTerm = this.searchItem.toLowerCase().trim();
    return this.eventList.filter(
      (eventItem) =>
        eventItem.title.toLowerCase().includes(searchTerm) ||
        eventItem.place.toLowerCase().includes(searchTerm)
    );
  }
}
