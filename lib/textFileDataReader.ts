import * as fs from 'fs';
import readline from 'readline';
import DataLoadedInfo from './dataLoadedInfo';
import DataReader, { DataLoadedEventType, ReadCompletedEventType } from './dataReader';

export default class TextFileDataReader implements DataReader {
    private _totalRowCount: number;
    readonly fileName: string;
    readonly hasHierarchicalRows: boolean;
    private _parentRowCount: number;
    dataLoadedEvent?: DataLoadedEventType;
    readCompletedEvent?: ReadCompletedEventType;

    constructor(fileName: string, hasHierarchicalRows: boolean = false) {
        this._totalRowCount = 0;
        this._parentRowCount = 0;
        this.fileName = fileName;
        this.hasHierarchicalRows = hasHierarchicalRows;
    }

    public get totalRowCount() {
        return this._totalRowCount;
    }

    public get parentRowCount() {
        return this._parentRowCount;
    }

    // private processRow(row: string): string {
    //     this._rowCount++;
    //     const currentRowIsChildRow = this.isChildRow(row);
    //     if (this.hasHierarchicalRows && currentRowIsChildRow && this.lastRowIsChildRow === false) {
    //         this._hierarchicalRowCount++;
    //     }
    //     this.lastRowIsChildRow = currentRowIsChildRow;

    //     if (!currentRowIsChildRow) {

    //     }

    //     return row;
    // }

    private isChildRow(data: string): boolean {
        const regex = /^[ \t]+\S/;
        return regex.test(data);
    }

    async read() {
        let data: string;
        const fileStream = fs.createReadStream(this.fileName);
      
        const readLine = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity
        });

        let parentRow: string = "";
        let childRows: string[] = [];

        let lastRowIsChildRow: boolean | null = null;
        for await (const row of readLine) {
            this._totalRowCount++;
            // Process regular rows.
            if (!this.hasHierarchicalRows) {
                if (this.dataLoadedEvent) {
                    const dataInfo = new DataLoadedInfo(row);
                    this.dataLoadedEvent(dataInfo);
                }
                continue;
            }

            // Process hierarchical rows.
            const currentRowIsChildRow = this.isChildRow(row);
            if (!currentRowIsChildRow) {
                if (lastRowIsChildRow !== null) {
                    if (this.dataLoadedEvent) {
                        const childRowsStr = childRows.length > 0 ? childRows.join('\n') : undefined;
                        const dataInfo = new DataLoadedInfo(parentRow, childRowsStr);
                        this.dataLoadedEvent(dataInfo);
                        childRows = [];
                    }
                    if (lastRowIsChildRow) {
                        this._parentRowCount++;
                    }
                }
                parentRow = row.trim();
            } else {
                childRows.push(row);
                if (lastRowIsChildRow === false) {
                    this._parentRowCount++;
                }
            }
            lastRowIsChildRow = currentRowIsChildRow;
        }
        if (this.dataLoadedEvent && childRows.length > 0) {
            const childRowsStr = childRows.join('\n');
            const dataInfo = new DataLoadedInfo(parentRow, childRowsStr);
            this.dataLoadedEvent(dataInfo);
        }

        if (this.readCompletedEvent) {
            this.readCompletedEvent();
        }
    }
}