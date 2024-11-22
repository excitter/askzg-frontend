import {currentYear} from '../util/util-functions';

export class EventFilter {
  training = true;
  event = true;
  other = true;
  year: number = currentYear();
}
