import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {RefractionService} from '../../service/refraction.service';
import {Refraction} from '../../model/refraction';
import {MembersService} from '../../service/members.service';
import {Member} from '../../model/member';
import {currentDate} from '../../util/util-functions';

@Component({
  selector: 'app-refraction-details',
  templateUrl: './refraction-details.component.html',
  styleUrls: ['./refraction-details.component.css']
})
export class RefractionDetailsComponent implements OnInit {
  refractions: Refraction[] = [];
  member: Member;
  refraction: Refraction;
  id: number;
  private sub: Subscription;

  constructor(
    private refractionService: RefractionService,
    private memberService: MembersService,
    private route: ActivatedRoute,
    private router: Router) {
    this.member = new Member();
    this.member.name = '';
  }

  ngOnInit() {
    this.resetRefraction();
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        this.router.navigate(['/refractions']);
      } else {
        this.id = id;
        this.reloadRefractions();
        this.memberService.getMember(id).then(
          (member) => {
            this.member = member.member;
          }
        );
      }
    });
  }

  onDelete(id: number) {
    this.refractionService.delete(id).then(
      (result) => {
        this.reloadRefractions();
      }
    );
  }

  onSave() {
    this.refraction.memberId = this.member.id;
    this.refractionService.save(this.refraction).then(
      (result) => {
        this.resetRefraction();
        this.reloadRefractions();
      }
    );
  }

  resetRefraction() {
    const e = new Refraction();
    e.createdAt = currentDate();
    e.comment = '';
    this.refraction = e;
  }

  reloadRefractions() {
    this.refractionService.getMemberRefractions(this.id).then(
      (refractions) => {
        this.refractions = refractions;
      }
    );
  }

}
