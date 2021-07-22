import TextParser from '../src/utils/parser/TextParser';

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

const mockedParsedTextFile = [
  ['John', 'Doe', '120 jefferson st.', 'Riverside', 'NJ', '08075'],
  ['Jack', 'McGinnis', '220 hobo Av.', 'Phila', 'PA', '09119'],
];

describe('Text Parser', () => {
  let textParser = null;

  beforeEach(() => {
    textParser = new TextParser(mockedTextFile);
  });

  it('Should correctly set the text file.', () => {
    expect(textParser.textFile).toEqual(mockedTextFile);
  });

  it('Should correctly parse a valid text file.', () => {
    expect(textParser.parse()).toEqual(mockedParsedTextFile);
  });
});
