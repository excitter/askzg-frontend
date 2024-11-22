import {Component, Input, OnInit} from '@angular/core';
import {EventParticipation, EventReport} from '../model/report-event';
import {EventsService} from '../service/events.service';

@Component({
  selector: 'app-event-report-table',
  templateUrl: './event-report-table.component.html',
  styleUrls: ['./event-report-table.component.css']
})
export class EventReportTableComponent implements OnInit {

  @Input() eventReport: EventReport;
  participation: EventParticipation = null;
  loading = false;

  constructor(private eventService: EventsService) {
  }

  ngOnInit() {
  }

  onOpenEventParticipation(participation: EventParticipation) {
    participation.participationMembers = this.eventReport.members
      .filter(m => participation.paidMemberIds.indexOf(m.id) !== -1 || participation.unpaidMemberIds.indexOf(m.id) !== -1);
    this.participation = participation;
  }

  toggleMemberPaid(memberId: number) {
    this.loading = true;
    this.eventService.toggleMemberPaid(this.participation.event.id, memberId).then(
      () => {
        if (this.participation.paidMemberIds.indexOf(memberId) !== -1) {
          const idx = this.participation.paidMemberIds.indexOf(memberId);
          this.participation.paidMemberIds.splice(idx, 1);
          this.participation.unpaidMemberIds.push(memberId);
        } else {
          const idx = this.participation.unpaidMemberIds.indexOf(memberId);
          this.participation.unpaidMemberIds.splice(idx, 1);
          this.participation.paidMemberIds.push(memberId);
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
}
