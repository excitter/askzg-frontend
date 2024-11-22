import {FormControl, NG_VALIDATORS} from '@angular/forms';
import {Directive} from '@angular/core';

export function validatePhone(control: FormControl) {
  const value = control.value;
  const len = value !== null ? control.value.length : 0;
  const ok = (len === 12 || len === 13) && /\+3859[1|2|5|8|9][[0-9]{6,7}/.test(value);
  return ok ? null : {'invalidPhone': {value: control.value}};
}

@Directive({
  selector: '[appPhone][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useValue: validatePhone,
      multi: true
    }
  ]
})
export class PhoneValidatorDirective {
}
