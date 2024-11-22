import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {LoginService} from '../service/login.service';
import {UserDataService} from '../service/user-data.service';
import {UserData} from '../model/user-data';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  userData: UserData = {loggedIn: false, role: '', page: ''};

  constructor(private loginService: LoginService, private userDataService: UserDataService) {
    userDataService.getData().subscribe((data: UserData) => {
      if (typeof data !== 'undefined') {
        this.userData = data;
      }
    });
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.userData.loggedIn) {
      return Promise.resolve(true);
    } else {
      return this.loginService.getCurrentUser().then(
        () => Promise.resolve(true),
        () => Promise.resolve(false)
      );
    }
  }
}
