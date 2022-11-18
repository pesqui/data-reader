# DataReader
DataReader is a Node.js library that provides an easy way to implement data migrations. Concreate data readers implements the DataReader interface.

## Installation
npm install @pesklab/data-reader

## Current Plugins

### TextFileDataReader
TextFileDataReader that allows migrate data from text files.

```
import TextFileDataReader, {DataLoadedInfo}  from '@pesklab/data-reader'

const textFileReader = new TextFileDataReader('./files/hierarchicalFile.txt', true);
textFileReader.dataLoadedEvent = (dataInfo: DataLoadedInfo) => {
	console.log(`\nRow ${textFileReader.parentRowCount}:`);
	console.log(dataInfo.parentRow);
	if (dataInfo.childRows) {
		console.log(dataInfo.childRows);
	}
};
textFileReader.readCompletedEvent = () => {
	console.log(`\nParent Rows: ${textFileReader.parentRowCount}`);
	console.log(`Total Rows: ${textFileReader.totalRowCount}\n`);
};
textFileReader.read();
```

