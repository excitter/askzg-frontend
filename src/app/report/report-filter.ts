import {currentYear} from '../util/util-functions';

export class ReportFilter {
  year: number = currentYear();
  active = true;
}
