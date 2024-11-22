import {Component, OnInit} from '@angular/core';
import {MemberMembershipReport} from '../model/report-membership';
import {ReportService} from '../service/report.service';
import {EventReport} from '../model/report-event';
import {downloadPdf} from '../util/pdf.util';
import {ExportService} from '../service/export.service';
import {ReportFilter} from './report-filter';
import {ActivatedRoute, Router} from '@angular/router';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';
import {currentYear} from '../util/util-functions';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  allReportMemberships: MemberMembershipReport[] = [];
  reportMemberships: MemberMembershipReport[] = null;
  eventReport: EventReport = null;
  activeDebt = 0;
  totalDebt = 0;
  currentYear: number;
  maxYear = currentYear() + 1;
  filter: ReportFilter = new ReportFilter();
  private sub: Subscription;

  constructor(private reportService: ReportService, private exportService: ExportService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(params => {
      filterOf(this.filter, params);
      if (this.currentYear !== this.filter.year) {
        this.currentYear = this.filter.year;
        this.loadReports(this.currentYear);
      } else {
        this.filterReportMemberships();
      }
    });
  }

  onYearChanged(value) {
    this.filter.year = value;
    this.router.navigate(['reports'], {queryParams: asParam(this.filter)});
  }

  loadReports(year) {
    this.reportMemberships = null;
    this.eventReport = null;
    this.activeDebt = 0;
    this.totalDebt = 0;
    this.reportService.getMembershipReport(year).then(
      (result) => {
        this.allReportMemberships = result;
        for (let i = 0; i < this.allReportMemberships.length; i++) {
          if (this.allReportMemberships[i].member.status !== 'INACTIVE') {
            this.activeDebt += this.allReportMemberships[i].debt;
          }
          this.totalDebt += this.allReportMemberships[i].debt;
        }
        this.filterReportMemberships();
      }
    );
    this.reportService.getEventReport(year).then(
      (result) => {
        this.eventReport = result;
      }
    );
  }

  onChangeDebt() {
    this.filterReportMemberships();
  }

  onFilterChanged() {
    this.router.navigate(['reports'], {queryParams: asParam(this.filter)});
  }

  onExport() {
    this.exportService.getReport(this.currentYear, this.filter.active).subscribe(
      (blob) => downloadPdf(blob, 'izvjesce-' + this.currentYear)
    );
  }

  filterReportMemberships() {
    this.activeDebt = 0;
    this.totalDebt = 0;
    for (let i = 0; i < this.allReportMemberships.length; i++) {
      this.totalDebt += this.allReportMemberships[i].debt;
    }
    const f = rm => !this.filter.active || rm.member.status === 'MEMBER' || rm.member.status === 'RECRUIT';
    this.reportMemberships = this.allReportMemberships.filter(f);
    for (let i = 0; i < this.reportMemberships.length; i++) {
      this.activeDebt += this.reportMemberships[i].debt;
    }
  }
}
