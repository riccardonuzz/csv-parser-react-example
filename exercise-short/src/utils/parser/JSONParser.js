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

export default JSONParser;
