import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';
import {ChangePasswordRequest} from '../model/change-password';
import {UserDataService} from '../service/user-data.service';
import {UserData} from '../model/user-data';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: UserData = null;
  request: ChangePasswordRequest = new ChangePasswordRequest();
  passwordSaving = false;
  pageSaving = false;
  error = false;

  constructor(private userService: UserService, private userDataService: UserDataService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().then(
      (user) => this.user = user
    );
  }

  changePassword() {
    this.passwordSaving = true;
    this.error = false;
    this.userService.changePassword(this.request).then(
      () => {
        this.request = new ChangePasswordRequest();
        this.passwordSaving = false;
      },
      () => {
        this.passwordSaving = false;
        this.error = true;
      }
    );
  }

  changePage() {
    this.pageSaving = true;
    this.userService.changeUser(this.user.page).then(
      () => {
        this.pageSaving = false;
        this.user.loggedIn = true;
        this.userDataService.updateData(this.user);
      },
      () => this.pageSaving = false
    );
  }
}
