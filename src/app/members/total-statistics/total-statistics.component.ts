import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StatisticsService} from '../../service/statistics.service';
import {MemberParticipation, MemberTotalStatistics} from '../../model/member-total-statistics';
import {toStatusName} from '../../util/util-functions';
import {MembersService} from '../../service/members.service';
import {Member} from '../../model/member';
import {PercentagePipe} from '../../pipes/percentage';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-total-statistics',
  templateUrl: './total-statistics.component.html',
  styleUrls: ['./total-statistics.component.css']
})
export class TotalStatisticsComponent implements OnInit {

  private sub: Subscription;
  statistics: MemberTotalStatistics = null;
  statisticsCompare: MemberTotalStatistics = null;
  toStatusName = toStatusName;
  members: Member[] = [];
  compareMemberId: number;
  memberId: number;
  tableEntries: ComparisonEntry[][];

  constructor(private route: ActivatedRoute, private router: Router, private statisticsService: StatisticsService,
              private memberService: MembersService, private percentagePipe: PercentagePipe) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (isNaN(id)) {
        this.router.navigate(['/members']);
      } else {
        this.memberId = id;
        this.memberService.getMembers().then(
          (members) => this.members = members.filter(m => m.id !== this.memberId)
        );
        this.statisticsService.getMemberTotalStatistics(id).then(
          (statistics) => {
            this.statistics = statistics;
            this.rebuild();
          },
          () => {
            this.router.navigate(['/members']);
          }
        );
      }
    });
    this.sub = this.route.queryParamMap.subscribe(params => {
      const compareId = +params.get('compare');
      if (compareId === this.memberId) {
        this.compareMemberId = 0;
        this.onCompareChange();
      } else if (compareId > 0) {
        this.compareMemberId = compareId;
        this.statisticsService.getMemberTotalStatistics(compareId).then(
          (stats) => {
            this.statisticsCompare = stats;
            this.rebuild();
          },
          () => {
            this.statisticsCompare = null;
          }
        );
      } else {
        this.compareMemberId = 0;
        this.statisticsCompare = null;
        if (this.statistics != null) {
          this.rebuild();
        }
      }
    });
  }

  rebuild() {
    this.tableEntries = [];
    if (this.statistics === null) {
      return;
    }
    const hasCompare = this.statisticsCompare !== null;
    const statMap = this.statistics.participations.reduce(function (map, obj) {
      map[obj.year] = obj;
      return map;
    }, {});
    const compareStatMap = !hasCompare ? {} : this.statisticsCompare.participations.reduce(function (map, obj) {
      map[obj.year] = obj;
      return map;
    }, {});


    const minYear = Math.min(Math.min.apply(Math,
      Object.keys(statMap).map(k => +k)), Math.min.apply(Math, Object.keys(compareStatMap).map(k => +k)));
    const maxYear = Math.max(Math.max.apply(Math,
      Object.keys(statMap).map(k => +k)), Math.max.apply(Math, Object.keys(compareStatMap).map(k => +k)));

    const te = [];
    const total = new MemberParticipation();
    const cmpTotal = new MemberParticipation();

    for (let year = minYear; year <= maxYear; year++) {
      const row: ComparisonEntry[] = [];
      row.push({text: year.toString(), greater: false});

      const participation = statMap[year];
      const cmpParticipation = compareStatMap[year];

      // Training
      if (!participation) {
        row.push({text: '', greater: false});
      } else {
        const greater = cmpParticipation && participation.attendedTrainings > cmpParticipation.attendedTrainings;
        row.push({text: this.statString(participation.attendedTrainings, participation.numOfTrainings), greater: greater});
        total.attendedTrainings += participation.attendedTrainings;
        total.numOfTrainings += participation.numOfTrainings;
      }
      if (!cmpParticipation) {
        if (hasCompare) {
          row.push({text: '', greater: false});
        }
      } else {
        const greater = participation && cmpParticipation.attendedTrainings > participation.attendedTrainings;
        row.push({text: this.statString(cmpParticipation.attendedTrainings, cmpParticipation.numOfTrainings), greater: greater});
        cmpTotal.attendedTrainings += cmpParticipation.attendedTrainings;
        cmpTotal.numOfTrainings += cmpParticipation.numOfTrainings;
      }
      // Events
      if (!participation) {
        row.push({text: '', greater: false});
      } else {
        const greater = cmpParticipation && participation.attendedEvents > cmpParticipation.attendedEvents;
        row.push({text: this.statString(participation.attendedEvents, participation.numOfEvents), greater: greater});
        total.attendedEvents += participation.attendedEvents;
        total.numOfEvents += participation.numOfEvents;
      }
      if (!cmpParticipation) {
        if (hasCompare) {
          row.push({text: '', greater: false});
        }
      } else {
        const greater = participation && cmpParticipation.attendedEvents > participation.attendedEvents;
        row.push({text: this.statString(cmpParticipation.attendedEvents, cmpParticipation.numOfEvents), greater: greater});
        cmpTotal.attendedEvents += cmpParticipation.attendedEvents;
        cmpTotal.numOfEvents += cmpParticipation.numOfEvents;
      }

      te.push(row);
    }

    const finalRow: ComparisonEntry[] = [];
    finalRow.push({text: 'Total', greater: false});
    finalRow.push({
      text: this.statString(total.attendedTrainings, total.numOfTrainings),
      greater: hasCompare && total.attendedTrainings > cmpTotal.attendedTrainings
    });
    if (hasCompare) {
      finalRow.push({
        text: this.statString(cmpTotal.attendedTrainings, cmpTotal.numOfTrainings),
        greater: cmpTotal.attendedTrainings > total.attendedTrainings
      });
    }
    finalRow.push({
      text: this.statString(total.attendedEvents, total.numOfEvents),
      greater: hasCompare && total.attendedEvents > cmpTotal.attendedEvents
    });
    if (hasCompare) {
      finalRow.push({
        text: this.statString(cmpTotal.attendedEvents, cmpTotal.numOfEvents),
        greater: cmpTotal.attendedEvents > total.attendedEvents
      });
    }
    te.push(finalRow);
    this.tableEntries = te;
  }

  statString(count: number, total: number) {
    return count + '/' + total + ' ' + this.percentagePipe.transform(count / total);
  }

  onCompareChange() {
    if (this.compareMemberId === 0) {
      this.router.navigate(['members', this.memberId, 'stats']);
    } else {
      this.router.navigate(['members', this.memberId, 'stats'], {queryParams: {compare: this.compareMemberId}});
    }
  }
}

export class ComparisonEntry {
  text: string;
  greater = false;
}
