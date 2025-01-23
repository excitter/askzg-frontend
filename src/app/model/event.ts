import {EventParticipation} from './event-participation';

export class Event {
  id: number;
  name: string;
  location: string;
  type: string;
  date: string;
  endDate: string;
  price: number;
  participation: EventParticipation[];
}
