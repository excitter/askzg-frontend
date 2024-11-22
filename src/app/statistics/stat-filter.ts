import {currentYear} from '../util/util-functions';

export class StatFilter {
  year: number = currentYear();
  active = true;
}
