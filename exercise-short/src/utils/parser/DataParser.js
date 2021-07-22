import MimeTypes from './MimeTypes';
import FileTypes from './FileTypes';
import CSVParser from './CSVParser';
import JSONParser from './JSONParser';
import TextParser from './TextParser';

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

export default DataParser;
