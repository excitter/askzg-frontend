import {Pipe, PipeTransform} from '@angular/core';
@Pipe({name: 'minimize'})
export class MinimizeTextPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length >= 50) {
      return value.substr(0, 50) + '...';
    }
    return value;
  }
}
