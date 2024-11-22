import {Pipe, PipeTransform} from '@angular/core';
@Pipe({name: 'eventTypeToText'})
export class EventTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'TRAINING':
        return 'Trening';
      case 'EVENT':
        return 'Susret';
      default:
        return 'Ostalo';
    }
  }
}
