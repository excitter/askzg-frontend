import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ExportService {

  constructor(private http: HttpClient) {
  }

  getMembers(member: boolean, recruit: boolean, inactive: boolean): Observable<Blob> {
    return this.http.get('/export/members?member=' + member + '&recruit=' + recruit + '&inactive=' + inactive, {responseType: 'blob'});
  }

  getEvents(year: number): Observable<Blob> {
    return this.http.get('/export/events?year=' + year, {responseType: 'blob'});
  }

  getPayments(year: number, income: boolean, expense: boolean, word: string): Observable<Blob> {
    const ww = word === null ? '' : '&word=' + word;
    const params = 'year=' + year + '&income=' + income + '&expense=' + expense + ww;
    return this.http.get('/export/payments?' + params, {responseType: 'blob'});
  }

  getReport(year: number, onlyActive: boolean): Observable<Blob> {
    return this.http.get('/export/report?year=' + year + '&onlyActive=' + onlyActive, {responseType: 'blob'});
  }

  getStatistics(year: number, onlyActive: boolean): Observable<Blob> {
    return this.http.get('/export/statistics?year=' + year + '&onlyActive=' + onlyActive, {responseType: 'blob'});
  }

  getRefractions(onlyActive: boolean): Observable<Blob> {
    return this.http.get('/export/refractions?onlyActive=' + onlyActive, {responseType: 'blob'});
  }
}
