import {Component, OnDestroy, OnInit} from '@angular/core';
import {Member} from '../../model/member';
import {EventsService} from '../../service/events.service';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {MembersService} from '../../service/members.service';
import {currentDate} from '../../util/util-functions';
import {Location} from '@angular/common';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {


  event: Event = new Event();
  private sub: any;
  members: Member[];
  saveInProgress = false;
  error = false;

  constructor(private eventsService: EventsService, private memberService: MembersService,
              private route: ActivatedRoute, private router: Router, private location: Location) {
  }

  ngOnInit() {
    this.memberService.getMembers().then(
      (members) => this.members = members.filter(m => m.status !== 'INACTIVE')
    );
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        const e = new Event();
        e.type = 'TRAINING';
        e.date = currentDate();
        e.participation = [];
        this.memberService.getMembersByAttendDate(e.date).then(
          (members) => {
            this.members = members;
            this.event = e;
          }
        );
      } else {
        this.eventsService.getEvent(id).then(
          (event) => {
            this.memberService.getMembersByAttendDate(event.date).then(
              (members) => {
                this.members = members;
                this.event = event;
              }
            );
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
    this.event.participation = this.event.participation.filter(p => p.type !== '');
    this.eventsService.saveEvent(this.event).then(
      (result) => {
        this.onBack();
      },
      (error) => {
        this.saveInProgress = false;
        this.error = true;
      }
    );
  }

  onDateChanged() {
    this.memberService.getMembersByAttendDate(this.event.date).then(
      (members) => {
        this.members = members;
      }, (error) => {

      }
    );
  }

  onBack() {
    this.location.back();
  }
}
