import {Component, OnInit} from '@angular/core';
import {StatisticsService} from '../service/statistics.service';
import {MemberStatistics, MonthlyTrainingStatistics, TrainingTimeStatistics} from '../model/statistics';
import {downloadPdf} from '../util/pdf.util';
import {ExportService} from '../service/export.service';
import {StatFilter} from './stat-filter';
import {ActivatedRoute, Router} from '@angular/router';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';
import {currentYear} from '../util/util-functions';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private statisticsService: StatisticsService, private exportService: ExportService,
              private route: ActivatedRoute, private router: Router) {
  }



  trainingTimeStatistics: TrainingTimeStatistics[] = [];
  memberStatistics: MemberStatistics[] = [];
  allMemberStatistics: MemberStatistics[] = [];
  monthlyTrainingStatistics: MonthlyTrainingStatistics[] = [];
  currentYear: number;
  loading1 = false;
  loading2 = false;
  loading3 = false;
  average: string;
  filter: StatFilter = new StatFilter();
  private sub: Subscription;

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(params => {
      filterOf(this.filter, params);
      if (this.currentYear !== this.filter.year) {
        this.currentYear = this.filter.year;
        this.loadStatistics(this.currentYear);
      } else {
        this.filterMemberStatistics();
      }
    });
  }

  onYearChanged(value: number) {
    this.filter.year = value;
    this.router.navigate(['statistics'], {queryParams: asParam(this.filter)});
  }

  private loadStatistics(year: number) {
    this.loading1 = true;
    this.loading2 = true;
    this.loading3 = true;
    this.statisticsService.getTrainingTimeStatistics(year).then(
      (response) => {
        if (response.length === 0) {
          this.average = '-';
        } else {
          let sum = 0;
          response.forEach(s => {
            sum = sum + s.members.length;
          });
          this.average = Number(sum / response.length).toFixed(1);
        }
        this.trainingTimeStatistics = response;
        this.loading1 = false;
      },
      () => this.loading1 = false
    );
    this.statisticsService.getMemberStatistics(year).then(
      (response) => {
        response.forEach(s => {
          s.attended = s.events.filter(e => e.type === 'ATTENDED').length;
          s.unableToAttend = s.events.filter(e => e.type === 'UNABLE_TO_ATTEND').length;
          s.missed = s.events.filter(e => e.type === 'NOT_ATTENDED').length;
          const total = (s.attended + s.missed);
          if (total === 0) {
            s.percentage = 0;
          } else {
            s.percentage = s.attended / total;
          }
        });
        response.sort((a, b) => {
          let v = b.attended - a.attended;
          if (v === 0) {
            v = b.percentage - a.percentage;
          }
          if (v === 0) {
            v = a.member.name.localeCompare(b.member.name);
          }
          return v;
        });
        this.allMemberStatistics = response;
        this.filterMemberStatistics();
        this.loading2 = false;
      },
      () => this.loading2 = false
    );
    this.statisticsService.getMonthlyTrainingStatistics(year).then((response) => {
        this.monthlyTrainingStatistics = response;
        this.loading3 = false;
      },
      () => this.loading3 = false);
  }

  onFilterChanged() {
    this.router.navigate(['statistics'], {queryParams: asParam(this.filter)});
  }

  filterMemberStatistics() {
    const f = rm => !this.filter.active || rm.member.status === 'MEMBER' || rm.member.status === 'RECRUIT';
    this.memberStatistics = this.allMemberStatistics.filter(f);
  }

  onExport() {
    this.exportService.getStatistics(this.currentYear, this.filter.active).subscribe(
      (blob) => downloadPdf(blob, 'statistika-' + this.currentYear)
    );
  }
}
