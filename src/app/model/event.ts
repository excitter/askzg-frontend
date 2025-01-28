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

  constructor() {
    this.participation = [];
  }
}

export function eventDateNum(event) {
    const [day, month, year] = event.date.split('.');
    const iday = parseInt(day, 10);
    const imonth = parseInt(month, 10);
    const iyear = parseInt(year, 10);
    return (new Date(iyear, imonth, iday)).getTime();
}
