import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MemberStatistics, MonthlyTrainingStatistics, TrainingTimeStatistics} from '../model/statistics';
import {MemberTotalStatistics} from '../model/member-total-statistics';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {
  }

  getTrainingTimeStatistics(year: number): Promise<TrainingTimeStatistics[]> {
    return this.http.get('/statistics/training/time?year=' + year).toPromise().then(
      (response) => response as TrainingTimeStatistics[],
      (error) => Promise.reject(error.message)
    );
  }

  getMonthlyTrainingStatistics(year: number): Promise<MonthlyTrainingStatistics[]> {
    return this.http.get('/statistics/training/monthly?year=' + year).toPromise().then(
      (response) => response as MonthlyTrainingStatistics[],
      (error) => Promise.reject(error.message)
    );
  }

  getMemberStatistics(year: number): Promise<MemberStatistics[]> {
    return this.http.get('/statistics/training/member?year=' + year).toPromise().then(
      (response) => response as MemberStatistics[],
      (error) => Promise.reject(error.message)
    );
  }

  getMemberTotalStatistics(id: number): Promise<MemberTotalStatistics> {
    return this.http.get('/statistics/total/member/' + id).toPromise().then(
      (response) => response as MemberTotalStatistics,
      (error) => Promise.reject(error.message)
    );
  }
}
