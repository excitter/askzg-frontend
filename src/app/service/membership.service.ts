import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MemberMembership} from '../model/member-membership';

@Injectable()
export class MembershipService {

  constructor(private http: HttpClient) {
  }

  getMemberMemberships(id: number, year: number): Promise<MemberMembership[]> {
    return this.http.get('/membership/member?id=' + id + '&year=' + year).toPromise().then(
      (response) => response as MemberMembership[],
      (error) => Promise.reject(error.message)
    );
  }

  payMembership(memberId: number, month: number, year: number): Promise<boolean> {
    const request = {memberId: memberId, month: month, year: year};
    return this.http.post('/membership/member', request).toPromise().then(
      () => Promise.resolve(true),
      (error) => Promise.reject(error.message)
    );
  }

  forgiveLastUnpaidMembership(memberId: number): Promise<boolean> {
    const request = {memberId: memberId};
    return this.http.post('/membership/forgive/last-unpaid', request).toPromise().then(
      () => Promise.resolve(true),
      (error) => Promise.reject(error.message)
    );
  }
}
