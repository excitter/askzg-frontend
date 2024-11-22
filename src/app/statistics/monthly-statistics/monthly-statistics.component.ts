import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {MonthlyTrainingStatistics} from '../../model/statistics';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-monthly-statistics',
  templateUrl: './monthly-statistics.component.html',
  styleUrls: ['./monthly-statistics.component.css']
})
export class MonthlyStatisticsComponent implements OnInit, OnChanges {

  private monthNames: string[] = ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'];

  @Input() monthlyStatistics: MonthlyTrainingStatistics[];
  chart: Chart;

  constructor() {
  }

  ngOnInit() {
    this.buildChart();
  }

  ngOnChanges() {
    this.buildChart();
  }

  buildChart() {
    const months = this.monthlyStatistics.map(s => this.monthNames[s.month - 1]);
    const counts = this.monthlyStatistics.map(s => s.count);
    const average = this.monthlyStatistics.map(s => s.average);
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: months
      },
      plotOptions: {
        series: {
          pointInterval: 1
        }
      },
      series: [
        {
          type: 'line',
          name: 'Broj treninga',
          data: counts
        }, {
          type: 'line',
          name: 'Prosjek',
          data: average
        }
      ]
    });
  }
}
