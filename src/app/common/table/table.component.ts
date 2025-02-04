import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { IDynamicTable, ITableHeader } from "./table.model";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
})
export class DynamicTableComponent implements OnInit {

    @Input() data: IDynamicTable;
    @Input() headers: ITableHeader[];

    ngOnInit() {}

}
