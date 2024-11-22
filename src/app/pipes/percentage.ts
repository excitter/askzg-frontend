import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'percentage'})
export class PercentagePipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '0%';
    }
    return Number(100 * value).toFixed(0) + '%';
  }
}
