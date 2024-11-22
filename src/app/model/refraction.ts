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
