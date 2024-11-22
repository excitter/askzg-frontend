import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MemberMembershipReport} from '../model/report-membership';
import {EventReport} from '../model/report-event';

@Injectable()
export class ReportService {

  constructor(private http: HttpClient) {
  }

  getMembershipReport(year: number): Promise<MemberMembershipReport[]> {
    return this.http.get('/report/membership?year=' + year)
      .toPromise().then(
        (response) => response as MemberMembershipReport[],
        (error) => Promise.reject(error.message)
      );
  }

  getEventReport(year: number): Promise<EventReport> {
    return this.http.get('/report/event?year=' + year)
      .toPromise().then(
        (response) => response as EventReport,
        (error) => Promise.reject(error.message)
      );
  }

}
