import { Event } from "./event";
import { Refraction, RefractionReport, refractionsOwed } from "./refraction";
import { MemberMembershipReport } from "./report-membership";

export class MemberDebt {
    year: number;
    debt: number;
    membershipReport: MemberMembershipReport;
    eventDebts: Event[];
    refractionDebts: Refraction[];

    constructor(year: number, membershipReport: MemberMembershipReport, eventDebts: Event[], refractionReport?: RefractionReport) {
        this.year = year;
        this.debt = 0;
        this.membershipReport = membershipReport;
        this.eventDebts = eventDebts;
        this.refractionDebts = refractionReport != null ? refractionsOwed(refractionReport) : [];

        this. debt += this.membershipReport.debt;
        this.eventDebts.forEach(event => {
            this.debt += event.price;
        });
        this.debt += this.refractionDebts.length * 4;
    }

    debthManifest(): String[] {
        var manifest = [];
        if (this.membershipReport.debt > 0) {
            manifest.push(`Članarina ${this.membershipReport.member.membership}€ - Dug (mejseci) : ${this.membershipReport.owedMonths.join(', ')} = ${this.membershipReport.debt}€`);
        }
        manifest = manifest.concat(this.eventDebts.map(eventDebtString));
        if (this.refractionDebts.length > 0) {
            manifest.push(`Kazne - ${this.refractionDebts.length} = ${this.refractionDebts.length * 4}€`);
        }
        return manifest;
    }
}

function eventDebtString(event: Event): String {
    return`${event.type} - ${niceEvent(event)} = ${event.price}€`;
}

function niceEvent(event: Event): String {
    switch (event.type) {
        case 'TRAINING':
            return "Trening"
        case 'EVENT':
            return "Susret"
        case 'OTHER':
            return "Ostalo"
        default:
            return "Događjaj"
    }
}
