/**
 * @description Simulating enums with ES6 by freezing the object
 */
const MimeTypes = {
  // csv mime types
  APPLICATION_CSV: 'application/csv',
  APPLICATION_X_CSV: 'application/x-csv',
  APPLICATION_VND_MS_EXCEL: 'application/vnd.ms-excel',
  TEXT_CSV: 'text/csv',
  TEXT_COMMA_SEPARATED_VALUES: 'text/comma-separated-values',
  TEXT_X_CSV: 'text/x-csv',
  TEXT_X_COMMA_SEPARATED_VALUES: 'text/x-comma-separated-values',
  TEXT_TAB_SEPARATED_VALUES: 'text/tab-separated-values',

  // json mime types
  APPLICATION_JSON: 'application/json',
  APPLICATION_JAVASCRIPT: 'application/javascript',

  // text mime types
  APPLICATION_TEXT: 'application/text',
  TEXT_PLAIN: 'text/plain',
};
Object.freeze(MimeTypes);

/**
 * @description Simulating enums with ES6 by freezing the object
 */
const FileTypes = {
  CSV: 'csv',
  TEXT: 'txt',
  JSON: 'json',
};

Object.freeze(FileTypes);

/**
 * @description DataParser class which checks mime type and extension of
 * a given file and use the correct parser
 */
class DataParser {
  /**
   *
   * @param {string} file The stringified file
   * @param {File} fileInfo File object with informations
   */
  constructor(file, fileInfo) {
    this.file = file;
    this.fileInfo = fileInfo;
  }

  /**
   * @description Parse a given file with the right parser
   * @returns {Array<Array<string>>} A formatted matrix ready for being represented in a table
   */
  parse() {
    switch (this.fileInfo.type) {
      case MimeTypes.APPLICATION_CSV:
      case MimeTypes.APPLICATION_X_CSV:
      case MimeTypes.TEXT_CSV:
      case MimeTypes.TEXT_X_CSV:
      case MimeTypes.TEXT_COMMA_SEPARATED_VALUES:
      case MimeTypes.TEXT_X_COMMA_SEPARATED_VALUES:
      case MimeTypes.TEXT_TAB_SEPARATED_VALUES:
      case MimeTypes.APPLICATION_VND_MS_EXCEL:
        return new CSVParser(this.file).parse();

      case MimeTypes.APPLICATION_JSON:
      case MimeTypes.APPLICATION_JAVASCRIPT:
        return new JSONParser(this.file).parse();

      case MimeTypes.APPLICATION_TEXT:
      case MimeTypes.TEXT_PLAIN:
        return new TextParser(this.file).parse();

      default:
        return this.parseByFileExtension(); // less accurante, just in case the file has no mime type
    }
  }

  /**
   * @description Try to parse a file by matching it's extension
   * @returns {Array<Array<string>>} A formatted matrix ready for being represented in a table
   */
  parseByFileExtension() {
    const extension = this.fileInfo.name.split('.').pop();
    switch (extension) {
      case FileTypes.CSV:
        return new CSVParser(this.file).parse();

      case FileTypes.JSON:
        return new JSONParser(this.file).parse();

      case FileTypes.TEXT:
        return new TextParser(this.file).parse();

      default:
        throw new Error('File type not supported.');
    }
  }
}

/**
 * @description A RFC4180 compliant parser for .csv files
 */
class CSVParser {
  /**
   *
   * @param {string} rawCSV CSV file to parse (as string)
   */
  constructor(rawCSV) {
    this.rawCSV = rawCSV;
  }

  /**
   *
   * @returns {Array<Array<string>>} Parse the setted rawCSV managing all possible errors
   */
  parse() {
    if (this.rawCSV) {
      const parsedCSV = this.CSVToArray(this.rawCSV);

      if (parsedCSV) {
        if (this.checkRowsConsistency(parsedCSV)) {
          return parsedCSV;
        }

        throw new Error('Rows are not compatible with header specification. Header length differs from data length.');
      } else {
        throw new Error('Error while parsing file.');
      }
    } else {
      throw new Error('No file to parse selected.');
    }
  }

  /**
   * @description Checks that given data respect the schema (first row of a CSV file)
   * @param {Array<Array<string>>} parsedCSV
   * @returns {boolean} true if every line has the header length, false otherwise
   */
  checkRowsConsistency(parsedCSV) {
    const headerLength = parsedCSV[0].length;
    return parsedCSV.every((line) => line.length === headerLength);
  }

  /**
   * @description A RFC4180 compliant parser for CSV files. Wiriting from 0 a performant CSV parser
   * manages all cases (including edge cases with ", "", ', escaped carachters and commas) requires
   * a very huge amount of time so I decided to go for a tested solution
   * @see https://stackoverflow.com/questions/1293147/example-javascript-code-to-parse-csv-data
   * @param {string} strData CSV file as a string
   * @param {string} strDelimiter A delimiter can be specified, usually a ',' for CSV
   * @returns {Array<Array<string>>} A formatted matrix ready for being represented in a table
   */
  CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    const delimiter = (strDelimiter || ',');

    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
      (
        // Delimiters.
        '(\\' + delimiter + '|\\r?\\n|\\r|^)' +

        // Quoted fields.
        '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +

        // Standard fields.
        '([^\"\\' + delimiter + '\\r\\n]*))'
      ),
      'gi',
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;

    // particular case in which file is a double quote (the algorithm loops)
    if (strData === '"') {
      return null;
    }

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
      // Get the delimiter that was found.
      const strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length
        && strMatchedDelimiter !== delimiter
      ) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      let strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(
          new RegExp('\"\"', 'g'),
          '\"',
        );
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
  }
}

/**
 * @description JSON parser with error management
 */
/**
 * @description JSON parser with error management
 */
class JSONParser {
  /**
   *
   * @param {string} jsonFile A JSON file in string format.
   * It must respect the following schema:
   * {
   *    "values": [
   *       Objects should go here
   *    ]
   * }
   */
  constructor(jsonFile) {
    this.jsonFile = jsonFile;
  }

  /**
   * @description parse a JSON file converting it in a Array<Array<string>> format adding the header
   * @returns {Array<Array<string>>} A formatted matrix ready for being represented in a table
   */
  parse() {
    const parsedJSON = JSON.parse(this.jsonFile);
    if (parsedJSON) {
      const headers = this.getHeadersFromFieldNames(parsedJSON.values);
      const isJSONSchemaValid = this.checkJSONSchema(parsedJSON.values);

      if (isJSONSchemaValid) {
        const formattedJSON = parsedJSON.values.map((singleObject) => Object.values(singleObject));
        return [headers, ...formattedJSON];
      }

      throw new Error('JSON schema is not valid.');
    }

    throw new Error('JSON file is not valid.');
  }

  /**
   * @description Check that all object in array have the same structure
   * @param  {Array<Object>} values Data entries to be checked
   * @returns {boolean} true if all objects in array have the same structure, false otherwise
   */
  checkJSONSchema(values) {
    if (values && values.length) {
      const firstElementKeys = Object.keys(values[0]);
      return values.every((element) => Object.keys(element).length === firstElementKeys.length)
        && values.every((element) => firstElementKeys.every((element2) => Object.keys(element).includes(element2)));
    }

    throw new Error('No values available in object\'s array.');
  }

  /**
   * @description Takes the property names of the object and converts it into
   * an array of human-readable string
   * @param {Array<Object>} json Array object must have a "values" property, an array of objects
   * @returns {Array<Array<string>>} A formatted matrix ready for being represented in a table
   */
  getHeadersFromFieldNames(json) {
    if (json.length) {
      return Object
        .keys(json[0])
        .map((header) => this.camelCaseToTitleCase(header));
    }

    throw new Error('No data available for this JSON file.');
  }

  /**
   * @description this method is used to convert object properties from camel case to
   * a human readable format
   * @see https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text
   * @param {string} in_camelCaseString a camel case string
   * @returns {string} A human readable string
   */
  camelCaseToTitleCase(inCamelCaseString) {
    const result = inCamelCaseString // "__ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser_456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
      .replace(/(_)+/g, ' ') // " ToGetYourGEDInTimeASongAboutThe26ABCsIsOfTheEssenceButAPersonalIDCardForUser 456InRoom26AContainingABC26TimesIsNotAsEasyAs123ForC3POOrR2D2Or2R2D"
      .replace(/([a-z])([A-Z][a-z])/g, '$1 $2') // " To Get YourGEDIn TimeASong About The26ABCs IsOf The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times IsNot AsEasy As123ForC3POOrR2D2Or2R2D"
      .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2') // " To Get YourGEDIn TimeASong About The26ABCs Is Of The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
      .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2') // " To Get Your GEDIn Time ASong About The26ABCs Is Of The Essence But APersonal IDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
      .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2') // " To Get Your GEDIn Time A Song About The26ABCs Is Of The Essence But A Personal ID Card For User456In Room26A ContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
      .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2') // " To Get Your GEDIn Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3POOr R2D2Or 2R2D"

      // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
      .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2') // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"
      .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2') // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC 26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"

      // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
      .replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2') // " To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
      .replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2') // " To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
      .trim(); // "To Get Your GED In Time A Song About The 26 ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"

    // capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}

/**
 * @description Text parser with error management
 */
class TextParser {
  /**
   *
   * @param {string} textFile text file as a string
   */
  constructor(textFile) {
    this.textFile = textFile;
  }

  /**
   * @description parse a text file with a \r as data separator
   * @returns {Array<Array<string>>} A formatted matrix ready for being represented in a table
   */
  parse() {
    const DATA_LINES = 6;
    const parsedTextFile = [[]];
    let dataCount = 0;
    this.textFile
      .split('\r')
      .forEach((word) => {
        if (parsedTextFile[dataCount].length === DATA_LINES) {
          parsedTextFile.push([]);
          dataCount++;
        } else {
          const escapedWord = word.replace(/(?:\\[rn]|[\r\n]+)+/g, '');
          parsedTextFile[dataCount].push(escapedWord);
        }
      });

    return parsedTextFile;
  }
}

function emptyTable(tableContainerElement) {
  while (tableContainerElement.firstChild) {
    tableContainerElement.removeChild(tableContainerElement.firstChild);
  }
}

/**
 * @param {HTMLElement} tableContainerElement DOM element reference to table
 * @param {Array<Array<string>>} data dataset to render into the table
 */
function renderTable(tableContainerElement, data) {
  emptyTable(tableContainerElement);
  const table = document.createElement('table');

  data.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((column) => {
      const td = document.createElement('td');
      td.innerHTML = column;
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  tableContainerElement.appendChild(table);
}

(function main() {
  // Reference to file uploader button
  const csvUploaderElement = document.querySelector('#csv-uploader');
  const tableContainerElement = document.querySelector('#table-container');

  csvUploaderElement.addEventListener('change', (changeEvent) => {
    const reader = new FileReader();
    reader.readAsText(changeEvent.target.files[0]);
    reader.onload = (loadEvent) => {
      const dataParser = new DataParser(loadEvent.target.result, changeEvent.target.files[0]);
      try {
        const parsedData = dataParser.parse();
        console.log(parsedData);

        renderTable(tableContainerElement, parsedData);
      } catch (error) {
        console.log('[Error]: ', error);
      }
    };
  });
}());
