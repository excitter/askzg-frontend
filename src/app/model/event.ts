import {EventParticipation} from './event-participation';

export class Event {
  id: number;
  name: string;
  type: string;
  date: string;
  price: number;
  participation: EventParticipation[];
}
