import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IDynamicTable, ITableHeader } from "./table.model";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
})
export class DynamicTableComponent implements OnInit {

    @Input() data: any[];
    @Input() headers: ITableHeader[];
    @Output() headerClickEvent = new EventEmitter<ITableHeader>();

    ngOnInit() {}

    headerClick(h) {
        if (this.headerClickEvent != null)  this.headerClickEvent.emit(h);
        var sortOrder = h.isAscending ? false : true;
        h.isAscending = sortOrder;
        var factor = sortOrder ? 1 : -1;
        this.headers.filter(x => x.index != h.index).forEach(x => x.isAscending = null);
        this.data.sort((a, b) => factor * (a[h.index] > b[h.index] ? 1 : -1) );
    }

}
