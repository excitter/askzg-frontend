import {currentYear} from '../util/util-functions';

export class PaymentFilter {
  year = currentYear();
  income = true;
  expense = true;
  text = '';
  page = 1;
}
