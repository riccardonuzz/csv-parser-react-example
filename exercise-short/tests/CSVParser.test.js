import CSVParser from '../src/utils/parser/CSVParser';

const mockedValidCSVFile = `First name, Last Name, Address, City, State, Postal Code\r
John,Doe,120 jefferson st.,Riverside, NJ, 08075\r
Jack,McGinnis,220 hobo Av.,Phila, PA,09119`;

const mockedCSVWithInvalidSchemaFile = `Last Name, Address, City, State, Postal Code\r
John,Doe,120 jefferson st.,Riverside, NJ, 08075\r
Jack,McGinnis,220 hobo Av.,Phila, PA,09119`;

const mockedCSVWithQuotes = `First name, Last Name, Address, City, State, Postal Code\r
"John ""Da Man""",Repici,120 Jefferson St.,Riverside, NJ,08075`;

const mockedFormattedCSVFile = [
  ['First name', ' Last Name', ' Address', ' City', ' State', ' Postal Code'],
  ['John', 'Doe', '120 jefferson st.', 'Riverside', ' NJ', ' 08075'],
  ['Jack', 'McGinnis', '220 hobo Av.', 'Phila', ' PA', '09119'],
];

const mockedFormattedCSVFileWithQuotes = [
  ['First name', ' Last Name', ' Address', ' City', ' State', ' Postal Code'],
  ['John "Da Man"', 'Repici', '120 Jefferson St.', 'Riverside', ' NJ', '08075'],
];

describe('CSV Parser', () => {
  let csvParser = null;

  beforeEach(() => {
    csvParser = new CSVParser(mockedValidCSVFile);
  });

  /** TESTING constructor(rawCSV)  */

  it('Should correctly set the csv file', () => {
    expect(csvParser.rawCSV).toEqual(mockedValidCSVFile);
  });

  /** TESTING parse()  */

  it('Should correcyly parse a valid csv file', () => {
    expect(csvParser.parse()).toEqual(mockedFormattedCSVFile);
  });

  it('Should throw an error when NO CSV is provided', () => {
    csvParser.rawCSV = null;
    expect(() => csvParser.parse()).toThrow(new Error('No file to parse selected.'));
  });

  it('Should throw an error when schema is NOT VALID', () => {
    csvParser.rawCSV = mockedCSVWithInvalidSchemaFile;
    expect(() => csvParser.parse()).toThrow(new Error('Rows are not compatible with header specification. Header length differs from data length.'));
  });

  it('Should throw an error when an INVALID csv is provided', () => {
    csvParser.rawCSV = '"';
    expect(() => csvParser.parse()).toThrow(new Error('Error while parsing file.'));
  });

  it('Should successfully parse CSV with double quotes', () => {
    csvParser.rawCSV = mockedCSVWithQuotes;
    expect(csvParser.parse()).toEqual(mockedFormattedCSVFileWithQuotes);
  });
});
