import {Component, OnInit} from '@angular/core';
import {MemberMembershipReport, trimUnpaid} from '../model/report-membership';
import {ReportService} from '../service/report.service';
import {EventReport} from '../model/report-event';
import {downloadPdf} from '../util/pdf.util';
import {ExportService} from '../service/export.service';
import {ReportFilter} from './report-filter';
import {ActivatedRoute, Router} from '@angular/router';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';
import {currentYear} from '../util/util-functions';
import { eventDateNum } from '../model/event';
import { MemberDebt } from '../model/member-debt';
import { RefractionService } from '../service/refraction.service';
import { RefractionReport } from '../model/refraction';
import { AppDataService } from '../service/app-data.service';

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
  eventDebt = 0;
  currentYear: number;
  maxYear = currentYear() + 1;
  filter: ReportFilter = new ReportFilter();
  private sub: Subscription;
  quickContactReady = false;
  refractionReport: RefractionReport[] = [];
  memberDebtSummary: MemberDebt[] = [];

  constructor(private reportService: ReportService, private exportService: ExportService, private refractionService: RefractionService, private appDataService: AppDataService,
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
    this.refractionReport = [];
    this.memberDebtSummary = [];
    this.quickContactReady = false;
    
    Promise.all([
      this.loadMembershipReport(year),
      this.loadEventReports(year),
      this.loadRefractionReport(year),
    ]).then(() => {
      this.updateMemberDebt(year);
    });
  }

  updateMemberDebt(year: number) {
    var now = new Date();
    var yearNow = now.getFullYear();
    var monthNow = now.getMonth() + 1;
    this.memberDebtSummary = [];
    var debts = [];
    this.allReportMemberships.forEach( rm => {
      var member = rm.member;
      var events = this.eventReport.participations.filter(p => p.unpaidMemberIds.includes(member.id)).map(p => p.event);
      var refractions = this.refractionReport.filter(r => r.member.id === member.id);
      var rrefraction = (refractions.length > 0) ? refractions[0] : null;
      var debt = new MemberDebt(
        year,
        yearNow == this.currentYear ? trimUnpaid(rm, monthNow) : rm,
        events,
        rrefraction,
      );
      debts.push(debt);
    });
    this.memberDebtSummary = debts;
    this.quickContactReady = true;
  }

  loadRefractionReport(year): Promise<void> {
    return this.refractionService.getReport(false, year).then((result) => {
      this.refractionReport = result;
    });
  }

  loadMembershipReport(year): Promise<void> {
    return this.reportService.getMembershipReport(year).then(
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
  }

  loadEventReports(year): Promise<void> {
    return this.reportService.getEventReport(year).then(
      (result) => {
        this.eventDebt = 0;
        result.participations = result.participations.filter(p => p.event.price).sort((a, b) => eventDateNum(b.event)- eventDateNum(a.event));
        this.eventReport = result;
        for (let i=0; i<this.eventReport.participations.length; i++) {
          const p = this.eventReport.participations[i];
          this.eventDebt += p.event.price * p.unpaidMemberIds.length;
        };
      }
    );
  }

  memberPaid(member) {
    this.appDataService.reloadBalance();
    for (let i = 0; i < this.memberDebtSummary.length; i++) {
      var current = this.memberDebtSummary[i];
      if (current.membershipReport.member.id === member.id) {
        current.eventDebts = [];
        current.refractionDebts = [];
        current.membershipReport.debt = 0;
        current.membershipReport.paidMonths.concat(current.membershipReport.owedMonths);
        current.membershipReport.owedMonths = [];
        current.debt = 0;
      }
    }
  }

  onChangeDebt() {
    this.filterReportMemberships();
  }

  onEventChangeDebt() {
    this.loadEventReports(this.currentYear);
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
