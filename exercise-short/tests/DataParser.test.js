import DataParser from '../src/utils/parser/DataParser';
import MimeTypes from '../src/utils/parser/MimeTypes';

const mockedFileInfo = {
  name: 'example.csv',
  lastModified: 123124124,
  lastModifiedDate: new Date(),
  webkitRelativePath: '',
  size: 1233,
  type: MimeTypes.APPLICATION_CSV,
};

const mockedJSONFile = `{
  "values": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "address": "120 jefferson st.",
      "city": "Riverside",
      "state": "NJ",
      "postalCode": "08075"
    },
    {
      "firstName": "Jack",
      "lastName": "McGinnis",
      "address": "220 hobo Av.",
      "city": "Phila",
      "state": "PA",
      "postalCode": "09119"
    }
  ]
}`;

const mockedCSVFile = `First name, Last Name, Address, City, State, Postal Code\r
John,Doe,120 jefferson st.,Riverside, NJ, 08075\r
Jack,McGinnis,220 hobo Av.,Phila, PA,09119`;

const mockedTextFile = `John\r
Doe\r
120 jefferson st.\r
Riverside\r
NJ\r
08075\r
\r
Jack\r
McGinnis\r
220 hobo Av.\r
Phila\r
PA\r
09119
`;

const mockedFormattedCSVFile = [
  ['First name', ' Last Name', ' Address', ' City', ' State', ' Postal Code'],
  ['John', 'Doe', '120 jefferson st.', 'Riverside', ' NJ', ' 08075'],
  ['Jack', 'McGinnis', '220 hobo Av.', 'Phila', ' PA', '09119'],
];

const mockedFormattedJSONFile = [
  ['First Name', 'Last Name', 'Address', 'City', 'State', 'Postal Code'],
  ['John', 'Doe', '120 jefferson st.', 'Riverside', 'NJ', '08075'],
  ['Jack', 'McGinnis', '220 hobo Av.', 'Phila', 'PA', '09119'],
];

const mockedFormattedTextFile = [
  ['John', 'Doe', '120 jefferson st.', 'Riverside', 'NJ', '08075'],
  ['Jack', 'McGinnis', '220 hobo Av.', 'Phila', 'PA', '09119'],
];

describe('Data Parser', () => {
  let dataParser = null;

  beforeEach(() => {
    dataParser = new DataParser(mockedCSVFile, mockedFileInfo);
  });

  /** TESTING constructor(file, fileInfo)  */

  it('Should correctly set the file', () => {
    expect(dataParser.file).toEqual(mockedCSVFile);
    expect(dataParser.fileInfo).toEqual(mockedFileInfo);
  });

  /** TESTING parse()  */

  it('Should correctly parse a valid CSV file', () => {
    const csvMimeTypes = Object.values(MimeTypes).slice(0, 8);
    csvMimeTypes.forEach((csvMimeType) => {
      dataParser.fileInfo.type = csvMimeType;
      expect(dataParser.parse()).toEqual(mockedFormattedCSVFile);
    });
  });

  it('Should correctly parse a valid JSON file', () => {
    const jsonMimeTypes = Object.values(MimeTypes).slice(8, 10);
    dataParser.file = mockedJSONFile;
    jsonMimeTypes.forEach((jsonMimeType) => {
      dataParser.fileInfo.type = jsonMimeType;
      expect(dataParser.parse()).toEqual(mockedFormattedJSONFile);
    });
  });

  it('Should correctly parse a valid text file', () => {
    const textMimeTypes = Object.values(MimeTypes).slice(10, 12);
    dataParser.file = mockedTextFile;
    textMimeTypes.forEach((textMimeType) => {
      dataParser.fileInfo.type = textMimeType;
      expect(dataParser.parse()).toEqual(mockedFormattedTextFile);
    });
  });

  it('Should correctly parse by .csv file extension', () => {
    dataParser.fileInfo.type = null;
    expect(dataParser.parse()).toEqual(mockedFormattedCSVFile);
  });

  it('Should correctly parse by .json file extension', () => {
    dataParser.file = mockedJSONFile;
    dataParser.fileInfo.type = null;
    dataParser.fileInfo.name = 'example.json';

    expect(dataParser.parse()).toEqual(mockedFormattedJSONFile);
  });

  it('Should correctly parse by .txt file extension', () => {
    dataParser.file = mockedTextFile;
    dataParser.fileInfo.type = null;
    dataParser.fileInfo.name = 'example.txt';

    expect(dataParser.parse()).toEqual(mockedFormattedTextFile);
  });

  it('Should throw an error if file type is not supported', () => {
    dataParser.fileInfo.type = null;
    dataParser.fileInfo.name = 'example.mp3';

    expect(() => dataParser.parse()).toThrow(new Error('File type not supported.'));
  });
});
