import {UserData} from '../model/user-data';
import {Router} from '@angular/router';


const pageMap: Map<string, string> = new Map<string, string>()
  .set('MEMBERS', 'members').set('PAYMENTS', 'payments').set('EVENTS', 'events').set('REPORT', 'reports').set('STATISTICS', 'statistics');

export function redirectToUserPage(userData: UserData, router: Router) {
  let route = pageMap.get(userData.page);
  if (route === null) {
    route = 'members';
  }
  router.navigate(['/' + route]);
}
