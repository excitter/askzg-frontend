import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';
import {User} from '../model/user-data';
import {MembersService} from '../service/members.service';
import {Member} from '../model/member';
import { ClipboardService } from 'ngx-clipboard';

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

  constructor(private userService: UserService, private memberService: MembersService, private clipboardService: ClipboardService) {
  }

  ngOnInit() {
    this.loadUsers();
    this.loadMembers();
  }

  onAddUser() {
    this.userService.addUser(this.user.username).then(
      (created) => {
        this.user = created;
        this.loadUsers();
      }
    );
  }

  onCopy() {
      this.clipboardService.copyFromContent(this.user.password);
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
