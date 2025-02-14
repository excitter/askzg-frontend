import {Component, OnInit} from '@angular/core';
import {Payment} from '../model/payment';
import {PaymentService} from '../service/payment.service';
import {AppDataService} from '../service/app-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExportService} from '../service/export.service';
import {downloadPdf} from '../util/pdf.util';
import {AppData} from '../model/app-data';
import {PaymentFilter} from './payment-filter';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  pageSize = 15;
  allPayments: Payment[] = [];
  filteredPayments: Payment[] = [];
  payments: Payment[] = [];
  currentYear: number;
  currentPage: number;
  appData: AppData = {balance: null};
  filter: PaymentFilter = new PaymentFilter();
  private sub: Subscription;
  sumAll: number;
  sumFiltered: number;

  constructor(private paymentService: PaymentService, private appDataService: AppDataService, private route: ActivatedRoute,
              private router: Router, private exportService: ExportService) {
    this.appDataService.getDataObservable().subscribe((data: AppData) => {
      if (typeof data !== 'undefined') {
        this.appData = data;
      }
    });
    this.appData = this.appDataService.getData();
  }

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(params => {
      filterOf(this.filter, params);
      this.currentPage = this.filter.page;
      if (this.currentYear !== this.filter.year) {
        this.currentYear = this.filter.year;
        this.loadPayments(this.currentYear);
      } else {
        this.filterPayments();
      }
    });
  }

  onEdit(id) {
    this.router.navigate(['payments', id, 'edit']);
  }

  onDelete(id) {
    this.paymentService.deletePayment(id).then(
      () => {
        this.appDataService.reloadBalance();
        this.allPayments = this.allPayments.filter(p => p.id !== id);
        this.filter.page = 1;
        this.filterPayments();
        this.router.navigate(['payments'], {queryParams: asParam(this.filter)});
      },
      (error) => console.log(error)
    );
  }

  onPageChanged(page) {
    this.filter.page = page;
    this.router.navigate(['payments'], {queryParams: asParam(this.filter)});
  }

  processPagination(page) {
    this.currentPage = page;
    const min = (page - 1) * this.pageSize;
    const max = Math.min(this.filteredPayments.length, min + this.pageSize);
    this.payments = this.filteredPayments.slice(min, max);
  }

  onYearChanged(value) {
    this.filter.year = value;
    this.filter.page = 1;
    this.router.navigate(['payments'], {queryParams: asParam(this.filter)});
  }

  loadPayments(year) {
    this.paymentService.getPayments(year).then(
      (paymentReport) => {
        paymentReport.payments.sort((a, b) => {
          let v = a.timestamp - b.timestamp;
          if (v === 0) {
            v = a.id - b.id;
          }
          return v;
        });
        let currentBalance = paymentReport.startYearBalance;
        paymentReport.payments.forEach(p => {
          p.balance = currentBalance + p.amount;
          currentBalance = p.balance;
        });
        paymentReport.payments.sort((a, b) => {
          let v = b.timestamp - a.timestamp;
          if (v === 0) {
            v = b.id - a.id;
          }
          return v;
        });
        this.allPayments = paymentReport.payments;
        this.filterPayments();
      }
    );
  }

  onFilterChanged() {
    this.router.navigate(['payments'], {queryParams: asParam(this.filter)});
  }

  filterPayments() {
    const filterText = this.filter.text.toLocaleLowerCase().trim();
    this.filteredPayments = this.allPayments.filter(p =>
      (this.filter.income && p.amount >= 0 || this.filter.expense && p.amount < 0) &&
      !(!this.filter.transient && p.transientExpense) &&
      (filterText.length === 0 || p.comment.toLocaleLowerCase().indexOf(filterText) !== -1));
    this.sumAll = this.allPayments.map(p => p.amount).reduce(function (a, b) {
      return a + b;
    }, 0);
    if (this.filteredPayments.length === this.allPayments.length) {
      this.sumFiltered = null;
    } else {
      this.sumFiltered = this.filteredPayments.map(p => p.amount).reduce(function (a, b) {
        return a + b;
      }, 0);
    }
    this.processPagination(this.currentPage);
  }

  onExport() {
    const filterText = this.filter.text.toLocaleLowerCase().trim();
    const word = (filterText.length === 0) ? null : filterText;
    this.exportService.getPayments(this.currentYear, this.filter.income, this.filter.expense, this.filter.transient, word).subscribe(
      (blob) => downloadPdf(blob, 'placanja-' + this.currentYear)
    );
  }
}
