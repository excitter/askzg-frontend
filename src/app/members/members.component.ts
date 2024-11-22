import {Component, OnInit} from '@angular/core';
import {Member} from '../model/member';
import {MembersService} from '../service/members.service';
import {ExportService} from '../service/export.service';
// import 'rxjs/Rx';
import {downloadPdf} from '../util/pdf.util';
import {MemberFilter} from './member-filter';
import {ActivatedRoute, Router} from '@angular/router';
import {asParam, filterOf} from '../util/filter-util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  members: Member[] = [];
  allMembers: Member[] = [];
  filter: MemberFilter = new MemberFilter();
  private sub: Subscription;

  constructor(private membersService: MembersService, private exportService: ExportService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.loadMembers();
    this.sub = this.route.queryParamMap.subscribe(params => {
      filterOf(new MemberFilter(), params);
      this.filterMembers();
    });
  }

  loadMembers() {
    this.membersService.getMembers().then((members) => {
      this.allMembers = members;
      this.filterMembers();
    });
  }

  onFilterChanged() {
    this.router.navigate(['members'], {queryParams: asParam(this.filter)});
  }

  filterMembers() {
    this.members = this.allMembers.filter(m => m.status === 'MEMBER' && this.filter.member ||
      m.status === 'RECRUIT' && this.filter.recruit || m.status === 'INACTIVE' && this.filter.inactive);
  }

  onExport() {
    this.exportService.getMembers(this.filter.member, this.filter.recruit, this.filter.inactive).subscribe(
      (blob) => downloadPdf(blob, 'clanovi')
    );
  }
}
