import {Pipe, PipeTransform} from '@angular/core';
@Pipe({name: 'memberStatusToText'})
export class MemberStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'MEMBER':
        return 'Član';
      case 'RECRUIT':
        return 'Regrut';
      default:
        return 'Nije u klubu';
    }
  }
}
