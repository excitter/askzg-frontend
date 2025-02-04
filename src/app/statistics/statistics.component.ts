import {Component, OnInit, ViewChild} from '@angular/core';
import {StatisticsService} from '../service/statistics.service';
import {MemberStatistics, MonthlyTrainingStatistics, StatisticsV2, TrainingTimeStatistics} from '../model/statistics';
import {downloadPdf} from '../util/pdf.util';
import {ExportService} from '../service/export.service';
import {StatFilter} from './stat-filter';
import {ActivatedRoute, Router} from '@angular/router';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';
import { ITableHeader } from '../common/table/table.model';

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
  loading4 = false;
  average: string;
  statisticsV2: StatisticsV2 = null;
  memberHeaders = [
    'Član', 
    'Trening', '-', '?', '%', 'PP%',
    'Susret', '-', '?', '%', 'PP%',
    'Ostalo', '-', '?', '%', 'PP%',
  ].map((x, i) => ({key: x, index: i, isSelected: true}) as ITableHeader);
  eventHeaders = [
    'Datum', 'Događaj', 'Prisutni', 'Odsutni', 'Spriječeni', '%', 'PP%',
  ].map((x, i) => ({key: x, index: i, isSelected: true}) as ITableHeader);
  memberData = [];
  eventData = [];
  trainingData = [];
  otherData = [];
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

  private memberNames(mids: Array<number>) : Array<string> {
    return mids.map(mid => this.statisticsV2.members[mid].name)
  }

  private parseEventTable(eventType: string) {
    var breakdowns = this.statisticsV2.eventBreakdowns[eventType];
    if (breakdowns == null) breakdowns = [];
    var result = [];
    for (let i=0; i<breakdowns.length; ++i) {
      var current = breakdowns[i];
      var attended = current.attendedPct;
      var adjusted = current.adjustedPct;
      if (attended == adjusted) adjusted = null;
      result.push([
        this.statisticsV2.events[current.eventId].date,
        this.statisticsV2.events[current.eventId].name,
        this.memberNames(current.attendedMemberIds).length,
        this.memberNames(current.missedMemberIds).length,
        this.memberNames(current.unableToAttendMemberIds).length,
        attended,
        adjusted,
        this.memberNames(current.attendedMemberIds).join(", "),
        this.memberNames(current.missedMemberIds).join(", "),
        this.memberNames(current.unableToAttendMemberIds).join(", "),
      ]);
    }
    return result;
  }

  private parseEventData() {
    this.eventData = this.parseEventTable("EVENT");
    this.trainingData = this.parseEventTable("TRAINING");
    this.otherData = this.parseEventTable("OTHER");
  }

  private parseMemberData() {
    this.memberData = [];
    for(let i=0; i<this.statisticsV2.memberEventStatistics.length; i++) {
      var current = this.statisticsV2.memberEventStatistics[i];
      var trainingTotal = current.attendance["TRAINING"].totalPct;
      var trainingPossible = current.attendance["TRAINING"].possiblePct;
      if (trainingTotal == trainingPossible) trainingPossible = null;
      var eventTotal = current.attendance["EVENT"].totalPct;
      var eventPossible = current.attendance["EVENT"].possiblePct;
      if (eventTotal == eventPossible) eventPossible = null;
      var otherTotal = current.attendance["OTHER"].totalPct;
      var otherPossible = current.attendance["OTHER"].possiblePct;
      if (otherTotal == otherPossible) otherPossible = null;
      this.memberData.push([
        this.statisticsV2.members[current.memberId].name,
        current.attendance["TRAINING"].attended,
        current.attendance["TRAINING"].didntAttend,
        current.attendance["TRAINING"].couldntAttend,
        trainingTotal,
        trainingPossible,
        current.attendance["EVENT"].attended,
        current.attendance["EVENT"].didntAttend,
        current.attendance["EVENT"].couldntAttend,
        eventTotal,
        eventPossible,
        current.attendance["OTHER"].attended,
        current.attendance["OTHER"].didntAttend,
        current.attendance["OTHER"].couldntAttend,
        otherTotal,
        otherPossible,
      ]);
    }
  }

  private loadStatistics(year: number) {
    this.loading1 = true;
    this.loading4 = true;
    this.statisticsService.getStatisticsV2(year).then(
      (response) => {
        this.statisticsV2 = response;
        this.parseMemberData();
        this.parseEventData();
        this.loading4 = false;
      },
      () => this.loading4 = false,
    )
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
