/**
 * @description Simulating enums with ES6 by freezing the object
 */
const FileTypes = {
  CSV: 'csv',
  TEXT: 'txt',
  JSON: 'json',
};

Object.freeze(FileTypes);

export default FileTypes;
