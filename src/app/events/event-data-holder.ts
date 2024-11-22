import {Injectable} from '@angular/core';

@Injectable()
export class EventDataHolder {
  private _year: number = null;

  get year(): number {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
  }
}
