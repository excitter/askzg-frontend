import {Component, HostListener, OnInit} from '@angular/core';
import {UserData} from '../model/user-data';
import {UserDataService} from '../service/user-data.service';
import {LoginService} from '../service/login.service';
import {Router} from '@angular/router';
import {AppDataService} from '../service/app-data.service';
import {AppData} from '../model/app-data';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userData: UserData = {loggedIn: false, role: '', page: ''};
  appData: AppData = {balance: null};
  showMenu = false;

  constructor(private userDataService: UserDataService, private loginService: LoginService, private router: Router,
              private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.userDataService.getData().subscribe((data: UserData) => {
      if (typeof data !== 'undefined') {
        this.userData = data;
        if (this.userData.loggedIn) {
          this.appDataService.reloadBalance();
        }
      }
    });
    this.appDataService.getDataObservable().subscribe((data: AppData) => {
      if (typeof data !== 'undefined') {
        this.appData = data;
      }
    });
  }

  doLogout(): void {
    this.userDataService.updateData(new UserData(false, ''));
    localStorage.setItem('askzg-token', '');
    this.router.navigate(['/login']);
  }

  toggleMainMenu() {
    if (window.innerWidth <= 768) {
      this.showMenu = !this.showMenu;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.showMenu = window.innerWidth > 768;
  }

}
