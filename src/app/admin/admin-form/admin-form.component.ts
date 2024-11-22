import {Component, OnInit} from '@angular/core';
import {Member} from '../../model/member';
import {MembersService} from '../../service/members.service';
import {MembershipService} from '../../service/membership.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {

  members: Member[] = [];
  deleteEnabled = true;

  constructor(private memberService: MembersService, private membershipService: MembershipService) {
  }

  ngOnInit() {
    this.loadMembers();
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

  onDeleteLastMembership(memberId: number) {
    this.deleteEnabled = false;
    this.membershipService.forgiveLastUnpaidMembership(memberId).then(
      () => {
        this.deleteEnabled = true;
      },
      () => {
        this.deleteEnabled = true;
      }
    );
  }

}
