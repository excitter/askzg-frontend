import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MemberMembershipReport} from '../model/report-membership';
import {MembershipService} from '../service/membership.service';
import {AppDataService} from '../service/app-data.service';
import {ClipboardService} from 'ngx-clipboard';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Member} from '../model/member';

@Component({
  selector: 'app-report-membership',
  templateUrl: 'report-membership.component.html',
  styleUrls: ['report-membership.component.css']
})
export class ReportMembershipComponent implements OnInit {

  @Input() reportMembership: MemberMembershipReport;
  @Input() wantedYear: number;
  @Output() debtChangedEvent = new EventEmitter<Member>();
  state = 0;
  currentYear = new Date().getFullYear();
  currentMonth: number;
  copyInProgress = false;
  debtState = 0; // 0-red, 1-white, 2-green
  owedMonths: number[] = [];
  debtAmount: number;
  canCopy = true;
  copyText = '';
  whatsAppText: SafeHtml;
  nextToPay: number;

  constructor(private membershipService: MembershipService, private appDataService: AppDataService,
              private clipboardService: ClipboardService, private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    if (this.wantedYear < this.currentYear) {
      this.currentMonth = 12;
    } else {
      this.currentMonth = new Date().getMonth() + 1;
    }
    this.recalculateFields();
    this.calculateStatusClass();
  }

  onOpen(): void {
    if (this.reportMembership.owedMonths.length === 0) {
      return;
    }
    this.state = 1;
  }

  onPay(): void {
    if (this.reportMembership.owedMonths.length === 0) {
      return;
    }
    const month = this.reportMembership.owedMonths[0];
    this.state = 2;
    this.membershipService.payMembership(this.reportMembership.member.id, month, this.wantedYear).then(
      () => {
        this.reportMembership.owedMonths.shift();
        this.reportMembership.paidMonths.push(month);
        if (this.reportMembership.debt > 0) {
          this.reportMembership.debt = this.reportMembership.debt - this.reportMembership.member.membership;
          if (this.debtChangedEvent !== null) {
            this.debtChangedEvent.emit(this.reportMembership.member);
          }
        }
        if (this.reportMembership.owedMonths.length === 0) {
          this.state = 0;
        } else {
          this.state = 1;
        }
        this.appDataService.reloadBalance();
        this.recalculateFields();
        this.calculateStatusClass();
      },
      () => this.state = 1
    );
  }

  onCopy() {
    const months = this.owedMonths;
    const text = 'Članarina - Dug ' + this.wantedYear + ': ' + months.join(', ') + ' = ' + this.debtAmount + '€';
    this.clipboardService.copyFromContent(text);
    this.copyInProgress = true;
    setTimeout(() => {
      this.copyInProgress = false;
    }, 300);
  }

  recalculateFields() {
    this.debtAmount = 0;
    this.owedMonths = [];
    this.nextToPay = null;
    if (this.wantedYear < this.currentYear) {
      if (this.reportMembership.paidMonths.length !== 12) {
        this.debtState = 0;
        this.owedMonths = this.reportMembership.owedMonths;
        this.debtAmount = this.reportMembership.debt;
      } else {
        this.debtState = 2;
      }
    } else if (this.wantedYear === this.currentYear) {
      if (this.reportMembership.paidMonths.length === 12) {
        this.debtState = 2;
        this.owedMonths = [];
      } else {
        this.owedMonths = this.reportMembership.owedMonths.filter(m => m < this.currentMonth);
        if (this.owedMonths.length > 0) {
          this.debtState = 0;
          this.debtAmount = this.reportMembership.debt;
          this.nextToPay = this.reportMembership.owedMonths.filter(m => m >= this.currentMonth)[0];
        } else if (this.reportMembership.owedMonths.indexOf(this.currentMonth) !== -1) {
          this.debtState = 1;
          this.nextToPay = this.currentMonth;
        } else {
          this.debtState = 2;
          this.owedMonths = [];
          this.nextToPay = this.reportMembership.owedMonths[0];
        }
      }
    } else {
      this.debtState = 2;
      this.owedMonths = [];
      if (this.reportMembership.owedMonths.length !== 0) {
        this.nextToPay = this.reportMembership.owedMonths[0];
      }
    }
    this.canCopy = this.debtAmount > 0;
    if (this.canCopy) {
      const months = this.owedMonths;
      this.copyText = 'Članarina - Dug ' + this.wantedYear + ': ' + months.join(', ') + ' = ' + this.debtAmount + '€';
    } else {
      this.copyText = '';
    }
    if (this.canCopy && this.reportMembership.member.phone !== null) {
      const command = 'whatsapp://send?text=' + this.copyText + '&phone=' + this.reportMembership.member.phone;
      this.whatsAppText = this.domSanitizer.bypassSecurityTrustResourceUrl(command);
    } else {
      this.whatsAppText = null;
    }
  }

  calculateStatusClass(): string {
    switch (this.debtState) {
      case 2:
        return 'super';
      case 1:
        return 'ok';
      case 0:
      default:
        return 'danger';
    }
  }

}
