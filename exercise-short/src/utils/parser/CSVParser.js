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

export default CSVParser;
