import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Refraction, RefractionReport} from '../model/refraction';


@Injectable()
export class RefractionService {

  constructor(private http: HttpClient) {
  }

  getReport(onlyActive: boolean, year: number): Promise<RefractionReport[]> {
    return this.http.get('/refractions/report?onlyActive=' + onlyActive + '&year=' + year).toPromise()
      .then(
        (response) => response as RefractionReport[],
        (error) => Promise.reject(error.message)
      );
  }

  getMemberRefractions(memberId: number): Promise<Refraction[]> {
    return this.http.get('/refractions/report/member/' + memberId).toPromise()
      .then(
        (response) => response as Refraction[],
        (error) => Promise.reject(error.message)
      );
  }

  save(refraction: Refraction): Promise<Refraction> {
    return this.http.post('/refractions', refraction).toPromise()
      .then(
        (response) => response as Refraction,
        (error) => Promise.reject(error.message)
      );
  }

  pay(memberId: number): Promise<void> {
    return this.http.post('/refractions/member/' + memberId + '/pay', {}).toPromise()
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

  delete(id: number): Promise<void> {
    return this.http.delete('/refractions/' + id, {responseType: 'text'}).toPromise()
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

}
