import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChangePasswordRequest} from '../model/change-password';
import {User, UserData} from '../model/user-data';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Promise<UserData> {
    return this.http.get('/user/current')
      .toPromise().then(
        (response) => response as UserData,
        (error) => Promise.reject(error.message)
      );
  }

  getUsers(): Promise<User[]> {
    return this.http.get('/user')
      .toPromise().then(
        (response) => response as User[],
        (error) => Promise.reject(error.message)
      );
  }

  addUser(name: string): Promise<User> {
    return this.http.post('/user', {username: name})
      .toPromise().then(
        (response) => response as User,
        (error) => Promise.reject(error.message)
      );
  }

  deleteUser(id: number): Promise<void> {
    return this.http.delete('/user/' + id, {responseType: 'text'})
      .toPromise().then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

  changePassword(request: ChangePasswordRequest): Promise<void> {
    return this.http.put('/user/current/password', request, {responseType: 'text'})
      .toPromise().then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

  changeUser(page: string): Promise<void> {
    return this.http.put('/user/current', {page: page}, {responseType: 'text'})
      .toPromise().then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

}
