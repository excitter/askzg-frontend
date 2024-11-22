import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {Balance} from '../model/balance';

@Injectable()
export class BalanceService {


  constructor(private http: HttpClient) {
  }

  getBalance(): Promise<Balance> {
    return lastValueFrom(this.http.get('/balance'))
      .then(
        (balance) => balance as Balance,
        (error) => Promise.reject(error.message)
      );
  }
}
