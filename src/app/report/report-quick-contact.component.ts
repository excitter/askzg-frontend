import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MemberDebt } from "../model/member-debt";
import { ClipboardService } from "ngx-clipboard";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { QuickPayService } from "../service/quick-pay.service";
import { Member } from "../model/member";

@Component({
    selector: 'app-report-quick-contact',
    templateUrl: './report-quick-contact.component.html',
    styleUrls: ['./report-quick-contact.component.css']
})
export class ReportQuickContactComponent implements OnInit {

    @Input() memberDebtSummary: MemberDebt;
    @Output() debtChangedEvent = new EventEmitter<Member>();
    state = 0;
    canCopy = false;
    whatsAppText?: SafeHtml = null;
    text?: string = null

    constructor(private clipboardService: ClipboardService, private domSanitizer: DomSanitizer,
                private quickPayService: QuickPayService, 
    ) {}

    ngOnInit(): void {
        this.canCopy = this.memberDebtSummary.debt > 0;
        if (this.canCopy) {
            const manifest =  this.memberDebtSummary.debthManifest().join('  \r\n');
            this.text = `${manifest}\nUkupno = ${this.memberDebtSummary.debt}€`;
        }
        const phone = this.memberDebtSummary.membershipReport.member.phone;
        if (this.text != null && phone != null) {
            const formatted = `whatsapp://send?text=${this.text}&phone=${phone}`;
            this.whatsAppText = this.domSanitizer.bypassSecurityTrustResourceUrl(formatted);
        }
    }

    onOpen(): void {
        if (this.memberDebtSummary.debt == 0) {
            return;
        }
        this.state = 1;
    }

    onCopy() {
        this.clipboardService.copyFromContent(this.text);
    }

    calculateStatusClass(): string {
        if (this.memberDebtSummary.debt > 0) {
            return 'danger';
        }
        return 'super';
    }

    onPay(): void {
        if (this.memberDebtSummary.debt <= 0) {
            return;
        }
        this.quickPayService.payDebt(this.memberDebtSummary).then(() => {
            if (this.debtChangedEvent != null) {
                this.debtChangedEvent.emit(this.memberDebtSummary.membershipReport.member);
            }
            this.state = 0;
        });
    }
}
