import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventsService} from '../service/events.service';
import {dateCompare, Event} from '../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {EventDataHolder} from './event-data-holder';
import {ExportService} from '../service/export.service';
import {downloadPdf} from '../util/pdf.util';
import {EventFilter} from './event-filter';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';
import { AppDataService } from '../service/app-data.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  allEvents: Event[];
  events: Event[];
  currentYear: number;
  filter: EventFilter = new EventFilter();
  private sub: Subscription;

  constructor(private eventsService: EventsService, private exportService: ExportService, private appDataService: AppDataService,
              private router: Router, private eventDataHolder: EventDataHolder, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(params => {
      filterOf(this.filter, params);
      if (this.currentYear !== this.filter.year) {
        this.currentYear = this.filter.year;
        this.loadEvents(this.currentYear);
      } else {
        this.filterEvents();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onDelete(id) {
    this.eventsService.deleteEvent(id).then(
      () => {
        for (let i = 0; i < this.allEvents.length; i++) {
          if (this.allEvents[i].id === id) {
            this.allEvents.splice(i, 1);
            this.filterEvents();
            break;
          }
        }
      },
      (error) => console.log(error)
    );
  }

  onYearChanged(value) {
    this.filter.year = value;
    this.router.navigate(['events'], {queryParams: asParam(this.filter)});
  }

  loadEvents(year) {
    this.eventsService.getEvents(year).then(
      (events) => {
        this.allEvents = events.sort(dateCompare);
        this.filterEvents();
      }
    );
  }

  filterEvents() {
    this.events = this.allEvents.filter(e => e.type === 'TRAINING' && this.filter.training ||
      e.type === 'EVENT' && this.filter.event || e.type === 'OTHER' && this.filter.other);
  }

  onExport() {
    this.exportService.getEvents(this.currentYear).subscribe(
      (blob) => downloadPdf(blob, 'dogadaji-' + this.currentYear)
    );
  }

  onFilterChanged() {
    this.onYearChanged(this.currentYear);
  }

  onEventDeleted(id) {
    this.appDataService.reloadBalance();
    this.allEvents = this.allEvents.filter(e => e.id !== id);
    this.filterEvents();
  }
}
