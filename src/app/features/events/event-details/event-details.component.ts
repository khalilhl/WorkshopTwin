import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {

  id!:number;
  eventDetails!:Event;
  constructor(private  actRoute:ActivatedRoute, private dataService:DataService){}

  ngOnInit(){
    console.log(this.actRoute)
    this.id=this.actRoute.snapshot.params["id"];
    this.dataService.getEventByIdFromBackend(this.id).subscribe({
      next:(response)=>this.eventDetails=response,});
  }

}
