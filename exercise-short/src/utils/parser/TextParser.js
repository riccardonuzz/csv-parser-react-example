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

export default TextParser;
