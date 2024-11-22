import {Injectable} from '@angular/core';
import {Member} from '../model/member';
import {HttpClient} from '@angular/common/http';
import {MemberExtended} from '../model/member-extended';

@Injectable()
export class MembersService {

  constructor(private http: HttpClient) {
  }

  getMembers(): Promise<Member[]> {
    return this.http.get('/member').toPromise()
      .then(
        (response) => response as Member[],
        (error) => Promise.reject(error.message)
      );
  }

  getMembersByAttendDate(date: String): Promise<Member[]> {
    return this.http.get('/member/attend-date?date=' + date).toPromise()
      .then(
        (response) => response as Member[],
        (error) => Promise.reject(error.message)
      );
  }

  getMember(id: number): Promise<MemberExtended> {
    return this.http.get('/member/' + id).toPromise()
      .then(
        (response) => response as MemberExtended,
        (error) => Promise.reject(error.message)
      );
  }

  saveMember(member: MemberExtended): Promise<MemberExtended> {
    if (member.member.id) {
      return this.http.put('/member', member).toPromise()
        .then(
          (response) => response as MemberExtended,
          (error) => Promise.reject(error.message)
        );
    }
    return this.http.post('/member', member).toPromise()
      .then(
        (response) => response as MemberExtended,
        (error) => Promise.reject(error.message)
      );
  }
}
