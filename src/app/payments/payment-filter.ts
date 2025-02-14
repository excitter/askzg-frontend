import {currentYear} from '../util/util-functions';

export class PaymentFilter {
  year = currentYear();
  income = true;
  expense = true;
  transient = false;
  text = '';
  page = 1;
}
