export default class DataLoadedInfo {
    readonly parentRow: string;
    readonly childRows?: string;

    constructor(parentRow: string, childRows?: string) {
        this.parentRow = parentRow;
        this.childRows = childRows;
    }
}