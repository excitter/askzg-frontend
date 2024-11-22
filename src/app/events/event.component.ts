import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventsService} from '../service/events.service';
import {Event} from '../model/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event: Event;
  state = 0;
  @Output() eventDeleted = new EventEmitter<number>();

  constructor(private eventService: EventsService) {
  }

  ngOnInit() {
  }

  onDelete() {
    this.state = 2;
    this.eventService.deleteEvent(this.event.id).then(
      () => this.eventDeleted.emit(this.event.id),
      () => this.state = 1
    );
  }
}
