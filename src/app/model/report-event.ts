import {Event} from './event';
import {Member} from './member';

export class EventReport {
  members: Member[] = [];
  participations: EventParticipation[];
}

export class EventParticipation {
  event: Event;
  paidMemberIds: number[];
  unpaidMemberIds: number[];
  participationMembers: Member[] = [];
}

export class TogglePaidRequest {
  eventId: number;
  memberId: number;
}
