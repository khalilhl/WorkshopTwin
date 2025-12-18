import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'events',
    loadChildren: () =>
      import('./features/events/events.module').then((m) => m.EventsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./features/tickets/tickets.module').then((m) => m.TicketsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import('./features/feedback/feedback.module').then((m) => m.FeedbackModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
