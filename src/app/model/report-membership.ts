import {Member} from './member';

export class MemberMembershipReport {
  member: Member;
  paidMonths: number[];
  owedMonths: number[] = [];
  debt: number;

}

export function trimUnpaid(mmr: MemberMembershipReport, month: number): MemberMembershipReport {
  // shallow copy with a propper set of owedMonths
  var clone = new MemberMembershipReport();
  clone.member = mmr.member;;
  clone.paidMonths = mmr.paidMonths;
  clone.debt = mmr.debt;
  clone.owedMonths = mmr.owedMonths.filter(om => om < month)
  return clone;
}
