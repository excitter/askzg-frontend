import {Component, OnInit} from '@angular/core';
import {LoginService} from '../service/login.service';
import {Router} from '@angular/router';
import {UserDataService} from '../service/user-data.service';
import {redirectToUserPage} from '../util/page-redirect';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  userDataChecked = false;
  loginInProgress = false;
  loginError = false;

  constructor(private loginService: LoginService, private userDataService: UserDataService, private router: Router) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().then(
      (data) => {
        data.loggedIn = true;
        this.userDataService.updateData(data);
        redirectToUserPage(data, this.router);
      },
      () => {
        this.userDataChecked = true;
        this.loginInProgress = false;
        this.loginError = false;
      }
    );
  }

  doLogin(): void {
    this.loginInProgress = true;
    this.loginService.login(this.username, this.password).then(response => {
      localStorage.setItem('askzg-token', response);
      this.loginService.getCurrentUser().then(
        (userData) => {
          userData.loggedIn = true;
          this.userDataService.updateData(userData);
          this.loginInProgress = false;
          redirectToUserPage(userData, this.router);
        },
        () => {
          this.loginInProgress = false;
        }
      );
    }, err => {
      this.loginInProgress = false;
      this.loginError = true;
    });
  }
}
