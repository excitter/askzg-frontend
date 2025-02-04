export interface ITableHeader {
    key: string;
    index: number;
    isSelected: boolean;
}

export interface IDynamicTable {
    headers: ITableHeader[];
    data: any[];
}
