import {Component, Input, OnInit} from '@angular/core';
import {MemberStatistics} from '../model/statistics';

@Component({
  selector: 'app-member-statistics',
  templateUrl: './member-statistics.component.html',
  styleUrls: ['./member-statistics.component.css']
})
export class MemberStatisticsComponent implements OnInit {

  constructor() {
  }

  @Input() statistics: MemberStatistics;
  @Input() year: number;
  isList = false;

  ngOnInit() {
  }
}
