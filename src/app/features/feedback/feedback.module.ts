import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
  { path: '', component: FeedbackComponent }
];

@NgModule({
  declarations: [
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FeedbackModule { }

