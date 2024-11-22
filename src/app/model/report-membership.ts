import {Member} from './member';

export class MemberMembershipReport {
  member: Member;
  paidMonths: number[];
  owedMonths: number[] = [];
  debt: number;
}
