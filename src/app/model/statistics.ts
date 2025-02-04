import {Member} from './member';
import {Event} from './event';

export class TrainingTimeStatistics {
  date: string;
  location: string;
  members: string[];
}

export class MemberStatistics {
  member: Member;
  events: AttendanceData[];
  attended: number;
  unableToAttend: number;
  missed: number;
  percentage: number;
}

export class AttendanceData {
  name: string;
  type: string;
}

export class MonthlyTrainingStatistics {
  month: number;
  count: number;
  average: number;
}

export class EventBreakdownV2 {
  eventId: number;
  attendedMemberIds: number[];
  missedMemberIds: number[];
  unableToAttendMemberIds: number[];
  attendedPct?: number;
  adjustedPct?: number;
}

export class EventBreakdownV2Obj {
  EVENT?: EventBreakdownV2[];
  TRAINING?: EventBreakdownV2[];
  OTHER?: EventBreakdownV2[];
}

export class EventCountsV2 {
  attended: number;
  didntAttend: number;
  couldntAttend: number;
  totalPct?: number;
  possiblePct?: number;
}

export class EventCountV2Obj {
  EVENT?: EventCountsV2;
  TRAINING?: EventCountsV2;
  OTHER?: EventCountsV2;
}

export class MemberEventStatisticsV2 {
  memberId: number;
  attendance: EventCountV2Obj;
}

export class StatisticsV2 {
  members: Map<number, Member>;
  events: Map<number, Event>;
  eventBreakdowns: EventBreakdownV2Obj;
  memberEventStatistics: MemberEventStatisticsV2[];
}
