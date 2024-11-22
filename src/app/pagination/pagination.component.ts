import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() count: number;
  @Input() pageSize: number;
  @Input() page: number;
  @Output() pageChanged = new EventEmitter<number>();
  numberOfPages: number;

  constructor() {
  }

  ngOnInit() {
    this.numberOfPages = Math.ceil(this.count / this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.numberOfPages = Math.ceil(this.count / this.pageSize);
  }

  onPageChanged(value) {
    this.page = value;
    this.pageChanged.emit(value);
  }

}
