import TextFileDataReader from "../lib/textFileDataReader";

describe("TextFileDataReader class", () => {
    it("should read 5 lines from the file", async () => {
        const dataReader = new TextFileDataReader('./test/files/hierarchicalFile.txt', true);
        await dataReader.read();
        expect(dataReader.parentRowCount).toBe(3);
        expect(dataReader.totalRowCount).toBe(15);
    });
});