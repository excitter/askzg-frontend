import {Member} from './member';

export class Refraction {
  id: number;
  memberId: number;
  createdAt: string;
  comment: string;
  paid: boolean;
}

export class RefractionReport {
  member: Member;
  refractions: [Refraction];
}

export function refractionsOwed(rr: RefractionReport): Refraction[] {
  const total = rr.refractions.length;
  const paid = rr.refractions.filter(r => r.paid).length;;
  const covered = 2 * paid;
  const notCovered = Math.max(total - covered, 0);
  const owed = Math.floor(notCovered / 2);
  return rr.refractions.filter(r => !r.paid).slice(0, owed);
}