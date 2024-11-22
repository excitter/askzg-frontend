import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Event} from '../model/event';
import {TogglePaidRequest} from '../model/report-event';


@Injectable()
export class EventsService {

  constructor(private http: HttpClient) {
  }

  getEvents(year: number): Promise<Event[]> {
    return this.http.get('/event?year=' + year)
      .toPromise().then(
        (response) => response as Event[],
        (error) => Promise.reject(error.message)
      );
  }

  getEvent(id: number): Promise<Event> {
    return this.http.get('/event/' + id)
      .toPromise().then(
        (response) => response as Event,
        (error) => Promise.reject(error.message)
      );
  }

  saveEvent(event: Event): Promise<Event> {
    if (event.id) {
      return this.http.put('/event', event).toPromise()
        .then(
          (response) => response as Event,
          (error) => Promise.reject(error.message)
        );
    }
    return this.http.post('/event', event).toPromise()
      .then(
        (response) => response as Event,
        (error) => Promise.reject(error.message)
      );
  }

  deleteEvent(id: number): Promise<void> {
    return this.http.delete('/event/' + id, {responseType: 'text'}).toPromise()
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

  toggleMemberPaid(eventId: number, memberId: number): Promise<void> {
    const request: TogglePaidRequest = {memberId: memberId, eventId: eventId};
    return this.http.put('/event/paid', request, {responseType: 'text'}).toPromise()
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

}
