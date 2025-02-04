export interface ITableHeader {
    key: string;
    index: number;
    isAscending?: boolean
}

export interface IDynamicTable {
    headers: ITableHeader[];
    data: any[];
}
