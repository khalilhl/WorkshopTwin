import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participation } from '../../models/participation';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiParticipationsUrl = 'http://localhost:8081/api/participations';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  buyTicket(eventId: number, email: string, nbPlaces: number): Observable<Participation> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    const buyRequest = {
      userId: currentUser.id,
      eventId: eventId,
      email: email,
      nbPlaces: nbPlaces
    };

    return this.http.post<Participation>(`${this.apiParticipationsUrl}/buy`, buyRequest);
  }

  getUserTickets(): Observable<Participation[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    return this.http.get<Participation[]>(`${this.apiParticipationsUrl}/user/${currentUser.id}`);
  }

  cancelTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiParticipationsUrl}/${ticketId}/cancel`);
  }
}

