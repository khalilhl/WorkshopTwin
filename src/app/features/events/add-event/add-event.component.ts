import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { futurDateValidator } from '../../../shared/validators/futur-date.validator';
import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import type { Event } from '../../../models/event';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css',
})
export class AddEventComponent {
  [x: string]: any;
  eventForm!: FormGroup;
  newEvent = Event;

  constructor(private eventService: DataService, private router: Router) {
    this.eventForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('[a-zA-Z]*'),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(30),
      ]),
      date: new FormControl('', [Validators.required, futurDateValidator(7)]),
      prix: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\\.\\d+)?$'),
      ]),
      nbrPlace: new FormControl('', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]?$|^100$'),
      ]),
      lieu: new FormControl('', [Validators.required]),
      urlImage: new FormControl(''),
      nbLikes: new FormControl('0'),
      organisedId: new FormControl('1'),
      domaines: new FormArray([new FormControl('')]),
    });
  }

  ngOnInit() {
    //this.eventForm = FormGroup([]);
  }

  get title() {
    return this.eventForm.get('title');
  }
  get description() {
    return this.eventForm.get('description');
  }
  get date() {
    return this.eventForm.get('date');
  }

  get domaines() {
    return this.eventForm.get('domaines') as FormArray;
  }

  addDomain() {
    this.domaines.push(
      new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ])
    );
  }

  onSubmit() {
    // console.log(this.eventForm.value);
    // const formValue = this.eventForm.value;
    // let newEvent = {};
    // newEvent = formValue;
    // console.log(newEvent);
    const formValue = this.eventForm.value;
    const newEvent: Event = {
      id: 5,
      title: formValue.titre,
      description: formValue.description,
      date: new Date(formValue.date),
      price: Number(formValue.prix),
      nbPlaces: Number(formValue.nbPlaces),
      place: formValue.lieu,
      imageUrl: formValue.imageUrl || '',
      domaines: formValue.domaines,
      organizerId: 1,
      nbLikes: 0,
    };

    // this.eventService.addEvent(newEvent);
    this.router.navigate(['/events']);
  }
}
