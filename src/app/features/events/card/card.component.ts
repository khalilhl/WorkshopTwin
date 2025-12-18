import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../../models/event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() event!: Event; //  indiquer à la carde qu'elle va reçevoir des doinnées depuis le composant parent
  @Output() notifLike: EventEmitter<Event> = new EventEmitter();
  @Output() notifBuy: EventEmitter<Event> = new EventEmitter();

  constructor(private route: Router) {}
  likeEvent(e: Event) {
    this.notifLike.emit(e);
  }

  buyEvent(e: Event) {
    this.notifBuy.emit(e);
  }

  dateExpire(event: Event) {
    return new Date(event.date) < new Date();
  }

  participate(id: number, prix: number) {
    this.route.navigate(['/events/participate', id, prix]);
  }

  buyTicket(id: number, prix: number) {
    // Utiliser la même route que participate pour le formulaire
    this.route.navigate(['/events/participate', id, prix]);
  }
}
