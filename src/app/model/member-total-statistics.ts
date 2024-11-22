import {MemberExtended} from './member-extended';

export class MemberTotalStatistics {
  member: MemberExtended;
  activeDays: number;
  participations: MemberParticipation[];
}

export class MemberParticipation {
  year: number;
  attendedTrainings = 0;
  numOfTrainings = 0;
  attendedEvents = 0;
  numOfEvents = 0;
}
