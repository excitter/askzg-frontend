import {Component, OnInit} from '@angular/core';
import {UserData} from './model/user-data';
import {ServerCheckService} from './service/servercheck-service';
import {NavigationStart, Router} from '@angular/router';
import {LoginService} from './service/login.service';
import {UserDataService} from './service/user-data.service';
import {TitleService} from './service/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userData = new UserData(false, '');
  serverSleeping = false;
  title = '';

  constructor(private serverCheckService: ServerCheckService, private loginService: LoginService,
              private userDataService: UserDataService, private titleService: TitleService,
              private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.title = this.titleService.getTitle(val.url);
      }
    });

    this.userDataService.updateData(this.userData);
    this.userDataService.getData().subscribe((data: UserData) => {
      if (typeof data !== 'undefined') {
        this.userData = data;
      }
    });
    this.tryLogin();
  }

  loadData(count: number) {
    if (count > 5) {
      this.serverSleeping = true;
      return;
    }
    this.serverCheckService.isServerRunning()
      .then(
        () => this.tryLogin(),
        () => this.loadData(count + 1)
      );
  }

  tryLogin(): void {
    this.loginService.getCurrentUser().then(
      (userData: UserData) => {
        userData.loggedIn = true;
        let url = window.location.pathname;
        const params = this.getQueryParams(window.location.search);
        this.userDataService.updateData(userData);
        if (url === '/') {
          url = '/members';
        }
        this.router.navigate([url], {queryParams: params});
      },
      () => this.router.navigate(['/login'])
    );
  }

  private getQueryParams(search: string) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    const params = {};
    hashes.filter(hash => hash !== '').map(hash => {
      const [key, val] = hash.split('=');
      params[key] = decodeURIComponent(val);
    });
    return params;
  }
}
