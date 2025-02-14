import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';
import {RefractionService} from '../service/refraction.service';
import {RefractionReport} from '../model/refraction';
import {ExportService} from '../service/export.service';
import {downloadPdf} from '../util/pdf.util';
import { AppDataService } from '../service/app-data.service';

@Component({
  selector: 'app-refractions',
  templateUrl: './refractions.component.html',
  styleUrls: ['./refractions.component.css']
})
export class RefractionsComponent implements OnInit {

  allRefractionReports: RefractionReport[] = [];
  refractionReports: RefractionReport[] = [];
  filter: RefractionFilter = new RefractionFilter();
  private sub: Subscription;

  constructor(
    private refractionService: RefractionService,
    private exportService: ExportService,
    private appDataService: AppDataService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.loadReport();
    this.sub = this.route.queryParamMap.subscribe(params => {
      filterOf(this.filter, params);
      this.filterReportMemberships();
    });
  }

  loadReport() {
    this.refractionService.getReport(false).then((result) => {
        this.allRefractionReports = result;
        this.filterReportMemberships();
      }
    );
  }

  onFilterChanged() {
    this.router.navigate(['refractions'], {queryParams: asParam(this.filter)});
  }

  onExport() {
    this.exportService.getRefractions(this.filter.onlyActive).subscribe(
      (blob) => downloadPdf(blob, 'kazne')
    );
  }

  countDebtOwed(report: RefractionReport): Array<number> {
    const total = report.refractions.length;
    const paid = report.refractions.filter(r => r.paid).length;;
    const covered = 2 * paid;
    const notCovered = Math.max(total - covered, 0);
    const owed = Math.floor(notCovered / 2);
    return new Array(owed);
  }

  onPay(memberId: number) {
    this.refractionService.pay(memberId).then(() => {
      this.appDataService.reloadBalance();
      this.loadReport();
    });
  }

  filterReportMemberships() {
    const f = rm => !this.filter.onlyActive || rm.member.status === 'MEMBER' || rm.member.status === 'RECRUIT';
    this.refractionReports = this.allRefractionReports.filter(f);
  }

}

export class RefractionFilter {
  onlyActive = true;
}
