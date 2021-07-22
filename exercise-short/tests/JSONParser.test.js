import JSONParser from '../src/utils/parser/JSONParser';

const parsedJSON = {
  values: [
    {
      firstName: 'John',
      lastName: 'Doe',
      address: '120 jefferson st.',
      city: 'Riverside',
      state: 'NJ',
      postalCode: '08075',
    },
    {
      firstName: 'Jack',
      lastName: 'McGinnis',
      address: '220 hobo Av.',
      city: 'Phila',
      state: 'PA',
      postalCode: '09119',
    },
  ],
};

const parsedJSONWithInvalidSchema = {
  values: [
    {
      firstName: 'John',
      lastName: 'Doe',
      address: '120 jefferson st.',
      city: 'Riverside',
      state: 'NJ',
      postalCode: '08075',
    },
    {
      firstName: 'Jack',
      lastName: 'McGinnis',
      address: '220 hobo Av.',
      city: 'Phila',
    },
  ],
};

// this mock is missing some closing parenthesis
const mockedInvalidJSONFile = `{
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
    }`;

const mockedValidJSONFile = `{
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

// this mock is missing some properties in second object
const mockedJSONWithInvalidSchemaFile = `{
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
      "state": "PA",
      "postalCode": "09119"
    }
  ]
}`;

const mockedFormattedJSONFile = [
  ['First Name', 'Last Name', 'Address', 'City', 'State', 'Postal Code'],
  ['John', 'Doe', '120 jefferson st.', 'Riverside', 'NJ', '08075'],
  ['Jack', 'McGinnis', '220 hobo Av.', 'Phila', 'PA', '09119'],
];

describe('JSON Parser', () => {
  let jsonParser = null;

  beforeEach(() => {
    jsonParser = new JSONParser(mockedValidJSONFile);
  });

  /** TESTING constructor(jsonFile)  */

  it('Should correctly set the json file.', () => {
    expect(jsonParser.jsonFile).toEqual(mockedValidJSONFile);
  });

  /** TESTING parse()  */

  it('Should correctly parse a valid json file.', () => {
    expect(jsonParser.parse()).toEqual(mockedFormattedJSONFile);
  });

  it('Should throw an error when parsing and INVALID json file', () => {
    jsonParser.jsonFile = mockedInvalidJSONFile;
    expect(() => jsonParser.parse()).toThrow(SyntaxError);
  });

  it('Should throw an error when parsing a null json file', () => {
    jsonParser.jsonFile = null;
    expect(() => jsonParser.parse()).toThrow(new Error('JSON file is not valid.'));
  });

  it('Should throw an error when parsing json file with INVALID schema', () => {
    jsonParser.jsonFile = mockedJSONWithInvalidSchemaFile;
    expect(() => jsonParser.parse()).toThrow(new Error('JSON schema is not valid.'));
  });

  /** TESTING checkJSONSchema(values)  */

  it('Should return true when a valid schema is provided', () => {
    expect(jsonParser.checkJSONSchema(parsedJSON.values)).toBeTruthy();
  });

  it('Should return false when an INVALID schema is provided', () => {
    expect(jsonParser.checkJSONSchema(parsedJSONWithInvalidSchema.values)).toBeFalsy();
  });

  it('Should throw an error when an array IS NOT provided', () => {
    expect(() => jsonParser.checkJSONSchema(null))
      .toThrow(new Error('No values available in object\'s array.'));
  });

  /** TESTING  getHeadersFromFieldNames(json) */

  it('Should return a human readable string array', () => {
    expect(jsonParser.getHeadersFromFieldNames(parsedJSON.values)).toEqual(mockedFormattedJSONFile[0]);
  });

  it('Should throw an error if empty object is provided', () => {
    expect(() => jsonParser.getHeadersFromFieldNames({}))
      .toThrow(new Error('No data available for this JSON file.'));
  });
});
