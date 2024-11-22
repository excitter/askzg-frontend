import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserDataService} from '../service/user-data.service';
import {UserData} from '../model/user-data';
import {ServerCheckService} from '../service/servercheck-service';
import {redirectToUserPage} from '../util/page-redirect';

@Component({
  selector: 'app-start-component',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {

  serverSleeping = false;
  userData: UserData = null;

  constructor(private userDataService: UserDataService, private router: Router, private serverCheckService: ServerCheckService) {
    this.userDataService.getData().subscribe(data =>
      this.userData = data
    );
  }

  ngOnInit(): void {
    this.serverCheckService.isServerRunning().then(
      () => {
        this.serverSleeping = false;
        if (this.userData !== null && this.userData.loggedIn) {
          redirectToUserPage(this.userData, this.router);
        } else {
          this.router.navigate(['login']);
        }
      },
      () => {
        this.serverSleeping = true;
      }
    );
  }
}
