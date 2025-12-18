import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsComponent } from './tickets.component';


@NgModule({
  declarations: [
    TicketsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TicketsRoutingModule
  ]
})
export class TicketsModule { }
