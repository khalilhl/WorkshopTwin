export interface Participation {
  id?: number;
  userId: number;
  eventId: number;
  emailParticipant: string;
  nbPlaces: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  registrationDate?: Date;
}

export interface TicketWithEvent extends Participation {
  event?: {
    id: number;
    title: string;
    date: string;
    place: string;
    price: number;
    imageUrl: string;
  };
}
