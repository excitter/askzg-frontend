import {Injectable} from '@angular/core';
import {UserData} from '../model/user-data';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Promise<string> {
    const req = {username: username, password: password};
    return this.http.post('/login', req).toPromise().then(
      (response) => response['token'],
      (error) => Promise.reject(error.message)
    );
  }

  getCurrentUser(): Promise<UserData> {
    return lastValueFrom(this.http.get('/user/current'))
      .then(
        response => response as UserData,
        () => Promise.reject('')
      );
  }
}
