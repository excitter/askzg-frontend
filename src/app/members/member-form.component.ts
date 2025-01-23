import {Component, OnDestroy, OnInit} from '@angular/core';
import {Member} from '../model/member';
import {MembersService} from '../service/members.service';
import {currentDate} from '../util/util-functions';
import {ActivatedRoute, Router} from '@angular/router';
import {MemberStatusPeriod} from '../model/member-status-period';
import {MemberExtended} from '../model/member-extended';
import {Location} from '@angular/common';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html'
})
export class MemberFormComponent implements OnInit, OnDestroy {

  constructor(private memberService: MembersService, private route: ActivatedRoute, private router: Router, private location: Location) {
  }

  private sub: any;
  member: Member = null;
  periods: MemberStatusPeriod[] = [];
  saveInProgress = false;
  error = false;
  originalStatus: string;

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        this.member = new Member();
        this.periods = [];
        this.member.date = currentDate();
        this.member.membership = 100;
        this.member.idCardNumber = "";
      } else {
        this.memberService.getMember(id).then(
          (member) => {
            this.member = member.member;
            this.periods = member.periods;
            this.member.date = currentDate();
            this.originalStatus = this.member.status;
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSave() {
    this.saveInProgress = true;
    const data = new MemberExtended();
    data.member = this.member;
    data.periods = this.periods;
    this.memberService.saveMember(data).then(
      (result) => {
        this.saveInProgress = false;
        this.member = new Member();
        this.onBack();
      },
      (error) => {
        this.saveInProgress = false;
        this.error = true;
      }
    );
  }

  onBack() {
    this.location.back();
  }

  onAddPeriod() {
    const period = new MemberStatusPeriod();
    period.status = 'MEMBER';
    period.start = currentDate();
    this.periods.push(period);
  }
}
