import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MemberDebt } from "../model/member-debt";

@Injectable()
export class QuickPayService {

    constructor(private http: HttpClient) { }

    payDebt(memberDebt: MemberDebt): Promise<boolean> {
        const request = {
            year: memberDebt.year,
            memberId: memberDebt.membershipReport.member.id,
            membershipMonths: memberDebt.membershipReport.owedMonths,
            refractionIds: memberDebt.refractionDebts.map(refraction => refraction.id),
            eventIds: memberDebt.eventDebts.map(event => event.id),
        };
        return this.http.post('/quickpay/member', request).toPromise().then(
            () => Promise.resolve(true),
            (error) => Promise.reject(error.message),
        );
    }

}