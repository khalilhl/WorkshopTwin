import { Injectable } from '@angular/core';
import { Event } from '../../models/event';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiEventsUrl = 'http://localhost:8081/api/events';
  constructor(private _http:HttpClient){}

  getAllEventsFromBacked(): Observable<Event[]> {
    return this._http.get<Event[]>(this.apiEventsUrl)
  }

  getEventByIdFromBackend(id:number):Observable<Event>{
    return this._http.get<Event>(this.apiEventsUrl+'/'+id)
  }

  addEvent(event: any): Observable<Event> {
    return this._http.post<Event>(this.apiEventsUrl, event);
  }


//  eventList: Event[] = [
//     {
//       id: 1,
//       titre: 'Concert Jazz',
//       description: 'Un concert exceptionnel avec des artistes internationaux.',
//       date: new Date('2025-09-15T20:00:00'),
//       lieu: 'Théâtre Municipal',
//       prix: 50,
//       organisateurId: 101,
//       imageUrl: 'images/event.png',
//       nbPlaces: 0,
//       nbrLikes: 35,
//     },
//     {
//       id: 2,
//       titre: 'Conférence Tech IA',
//       description:
//         'Discussion autour des dernières tendances en intelligence artificielle.',
//       date: new Date('2025-11-02T09:00:00'),
//       lieu: 'Centre de Congrès',
//       prix: 0, // gratuit
//       organisateurId: 102,
//       imageUrl: 'images/event.png',
//       nbPlaces: 500,
//       nbrLikes: 120,
//     },
//     {
//       id: 3,
//       titre: 'Atelier Cuisine',
//       description: 'Apprenez à préparer des plats traditionnels tunisiens.',
//       date: new Date('2025-12-05T14:30:00'),
//       lieu: 'Espace Culturel',
//       prix: 25,
//       organisateurId: 103,
//       imageUrl: 'images/event.png',
//       nbPlaces: 30,
//       nbrLikes: 48,
//     },
//     {
//       id: 4,
//       titre: 'Marathon Carthage',
//       description: 'Une course sportive à travers les sites historiques.',
//       date: new Date('2026-01-20T07:00:00'),
//       lieu: 'Carthage',
//       prix: 10,
//       organisateurId: 104,
//       imageUrl: 'images/event.png',
//       nbPlaces: 1000,
//       nbrLikes: 300,
//     },
//   ];

//   constructor() { }


//   getEventList():Event[]{
//     return this.eventList;
//   }

//   getEventById(id:number):Event{
//     return this.eventList.filter(event=> event.id==id)[0];
//   }

//   addEvent(event:any){
//     return this.eventList.push(event);
//   }

}
