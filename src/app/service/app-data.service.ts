import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AppData} from '../model/app-data';
import {BalanceService} from './balance.service';

@Injectable()
export class AppDataService {

  private data1 = new Subject<AppData>();
  private appData = <AppData>{balance: null};


  constructor(private balanceService: BalanceService) {
  }

  getDataObservable(): Observable<AppData> {
    return this.data1.asObservable();
  }

  getData(): AppData {
    return this.appData;
  }

  reloadBalance() {
    this.balanceService.getBalance().then(
      (balance) => {
        this.appData = new AppData(balance.balance);
        this.data1.next(this.appData);
      }
    );
  }

}
