import {FormControl, NG_VALIDATORS} from '@angular/forms';
import {Directive} from '@angular/core';

const isLeap = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
const maxDays = (month, year) => {
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }
  if (month === 2) {
    return isLeap(year) ? 29 : 28;
  }
  return 31;
};

export function validateDate(control: FormControl) {
  if (control.value == null || control.value == "") return false;
  if (!control.value) {
    return {'invalidDate': {value: control.value}};
  }
  const split = control.value.split('.');
  if (split.length !== 3) {
    return {'invalidDate': {value: control.value}};
  }
  if (!/[0-9]+/.test(split[0]) || !/[0-9]+/.test(split[1]) || !/[[1-9][0-9]{3}/.test(split[2])) {
    return {'invalidDate': {value: control.value}};
  }
  const day = +split[0];
  const month = +split[1];
  const year = +split[2];
  if (month < 1 || month > 12 || day < 1 || day > maxDays(month, year)) {
    return {'invalidDate': {value: control.value}};
  } else {
    return null;
  }
}

@Directive({
  selector: '[appDateFormat][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useValue: validateDate,
      multi: true
    }
  ]
})
export class DateFormatValidatorDirective {
}
