import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {UserData} from '../model/user-data';

@Injectable()
export class UserDataService {

  private data1 = new Subject<UserData>();
  private data2: UserData = new UserData(false, '');

  getData(): Observable<UserData> {
    return this.data1.asObservable();
  }

  getRawData(): UserData {
    return this.data2;
  }

  updateData(data: UserData) {
    this.data1.next(data);
    this.data2 = data;
  }

}
