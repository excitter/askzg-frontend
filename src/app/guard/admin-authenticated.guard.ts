import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {LoginService} from '../service/login.service';
import {UserDataService} from '../service/user-data.service';
import {UserData} from '../model/user-data';

@Injectable()
export class AdminAuthenticatedGuard implements CanActivate {
  userData: UserData = {loggedIn: false, role: '', page: ''};

  constructor(private loginService: LoginService, private userDataService: UserDataService) {
    userDataService.getData().subscribe((data: UserData) => {
      if (typeof data !== 'undefined') {
        this.userData = data;
      }
    });
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.userData.loggedIn && this.userData.role === 'ADMIN') {
      return Promise.resolve(true);
    } else {
      return this.loginService.getCurrentUser().then(
        (user) => Promise.resolve(user.role === 'ADMIN'),
        () => Promise.resolve(false)
      );
    }
  }
}
