import {Injectable} from '@angular/core';

@Injectable()
export class PaymentDataHolder {
  private _page: number = null;
  private _year: number = null;

  get page(): number {
    return this._page;
  }

  get year(): number {
    return this._year;
  }


  set page(value: number) {
    this._page = value;
  }

  set year(value: number) {
    this._year = value;
  }
}
