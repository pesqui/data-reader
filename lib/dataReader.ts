import DataLoadedInfo from "./dataLoadedInfo";

export type DataLoadedEventType = (dataInfo: DataLoadedInfo) => void;
export type ReadCompletedEventType = () => void;

export default interface DataReader {
    totalRowCount: number;
    dataLoadedEvent?: DataLoadedEventType;
	readCompletedEvent?: ReadCompletedEventType;
    read(): void;
}