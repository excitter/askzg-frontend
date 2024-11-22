import {Member} from './member';

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
