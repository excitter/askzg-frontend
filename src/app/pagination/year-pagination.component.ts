import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {currentYear} from '../util/util-functions';

@Component({
  selector: 'app-year-pagination',
  templateUrl: './year-pagination.component.html',
  styleUrls: ['./year-pagination.component.css']
})
export class YearPaginationComponent implements OnInit {

  @Input() currentYear: number = currentYear();
  @Output() yearChanged = new EventEmitter<number>();
  @Input() minYear = 2015;
  @Input() maxYear = currentYear();

  constructor() {
  }

  ngOnInit() {
  }

  onYearChange(year) {
    this.currentYear = year;
    this.yearChanged.emit(year);
  }

}
