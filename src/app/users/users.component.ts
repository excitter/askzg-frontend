import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user-data';
import {MembersService} from '../service/members.service';
import {Member} from '../model/member';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user: User = new User();
  users: User[] = [];
  members: Member[] = [];
  saveInProgress = false;
  month: number;
  year: number;

  constructor(private userService: UserService, private memberService: MembersService) {
  }

  ngOnInit() {
    this.loadUsers();
    this.loadMembers();
  }

  onAddUser() {
    this.userService.addUser(this.user.username).then(
      () => {
        this.user = new User();
        this.loadUsers();
      }
    );
  }

  onDelete(id: number) {
    this.userService.deleteUser(id).then(
      () => {
        this.user = new User();
        this.loadUsers();
      }
    );
  }

  loadUsers() {
    this.userService.getUsers().then(
      (users) => this.users = users
    );
  }

  loadMembers() {
    this.memberService.getMembers().then(
      (members) => {
        this.members = members.filter(m => m.status === 'MEMBER' || m.status === 'RECRUIT');
      },
      () => {
      }
    );

  }
}
