import {Component, Input, OnInit} from '@angular/core';
import {Member} from '../../model/member';
import {Event} from '../../model/event';
import {EventParticipation} from '../../model/event-participation';

@Component({
  selector: 'app-event-participation',
  templateUrl: './event-participation.component.html',
  styleUrls: ['./event-participation.component.css']
})
export class EventParticipationComponent implements OnInit {

  @Input() member: Member;
  @Input() event: Event;
  eventParticipation: EventParticipation;
  state = 0;

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < this.event.participation.length; i++) {
      const p = this.event.participation[i];
      if (p.memberId === this.member.id) {
        this.eventParticipation = p;
        return;
      }
    }
    this.eventParticipation = {id: null, memberId: this.member.id, type: ''};
    this.event.participation.push(this.eventParticipation);
  }

  onStateChange() {
    if (this.event.type === 'TRAINING') {
      if (this.eventParticipation.type === 'ATTENDED') {
        this.eventParticipation.type = 'UNABLE_TO_ATTEND';
      } else if (this.eventParticipation.type === 'UNABLE_TO_ATTEND') {
        this.eventParticipation.type = '';
      } else {
        this.eventParticipation.type = 'ATTENDED';
      }
    } else {
      if (this.eventParticipation.type === 'ATTENDED') {
        this.eventParticipation.type = '';
      } else {
        this.eventParticipation.type = 'ATTENDED';
      }
    }
  }

  calculateStatusClass() {
    if (this.eventParticipation.type === 'ATTENDED') {
      return 'attending';
    }
    if (this.eventParticipation.type === 'UNABLE_TO_ATTEND') {
      return 'unable';
    }
    return '';
  }
}
