import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'shortEventName'})
export class ShortEventNamePipe implements PipeTransform {
  transform(value: string): string {
    const idx = value.indexOf('/');
    if (idx === -1) {
      return value;
    }
    return value.substr(0, idx);
  }
}
