import {Component, Input, OnInit} from '@angular/core';
import {TrainingTimeStatistics} from '../model/statistics';

@Component({
  selector: 'app-training-statistics',
  templateUrl: './training-statistics.component.html',
  styleUrls: ['./training-statistics.component.css']
})
export class TrainingStatisticsComponent implements OnInit {

  constructor() {
  }

  @Input() statistics: TrainingTimeStatistics;
  state = 0;

  ngOnInit() {
    this.statistics.date = this.statistics.date.substr(0, this.statistics.date.lastIndexOf('.'));
  }

}
