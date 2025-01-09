import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

export function validatePhone(control: FormControl) {
  const value = control.value;
  const len = value !== null ? control.value.length : 0;
  const ok = /\+3859[0-9]{7,8}/.test(value);
  return ok ? null : { 'invalidPhone': { value: control.value } };
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
