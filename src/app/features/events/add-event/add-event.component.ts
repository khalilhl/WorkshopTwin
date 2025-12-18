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
        Validators.pattern('[a-zA-Z0-9\\s\\-]+'),
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
    // Initialisation complétée dans le constructeur
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
    if (this.eventForm.invalid) {
      return;
    }

    const formValue = this.eventForm.value;
    
    // Convertir la date au format string (YYYY-MM-DD) pour JSON Server
    const dateObj = new Date(formValue.date);
    const dateString = dateObj.toISOString().split('T')[0];
    
    // Filtrer les domaines vides
    const domainesArray = formValue.domaines 
      ? formValue.domaines.filter((d: string) => d && d.trim() !== '')
      : [];

    // Préparer l'objet à envoyer (sans l'id pour que JSON Server le génère)
    const eventToSend: any = {
      title: formValue.title,
      description: formValue.description,
      date: dateString, // Format string pour JSON Server
      price: Number(formValue.prix),
      nbPlaces: Number(formValue.nbrPlace),
      place: formValue.lieu,
      imageUrl: formValue.urlImage || 'images/event.png',
      organizerId: Number(formValue.organisedId),
      nbLikes: 0,
    };

    // Ajouter les domaines seulement s'il y en a
    if (domainesArray.length > 0) {
      eventToSend.domaines = domainesArray;
    }

    console.log('Envoi de l\'événement:', eventToSend);

    this.eventService.addEvent(eventToSend).subscribe({
      next: (response) => {
        console.log('Événement ajouté avec succès:', response);
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
        console.error('Détails de l\'erreur:', error.error);
        alert(`Erreur lors de l'ajout de l'événement: ${error.message || 'Vérifiez que le serveur JSON Server est démarré sur le port 3000'}`);
      }
    });
  }
}
