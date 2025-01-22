import {EventParticipation} from './event-participation';

export class Event {
  id: number;
  name: string;
  location: string;
  type: string;
  date: string;
  price: number;
  participation: EventParticipation[];
}
