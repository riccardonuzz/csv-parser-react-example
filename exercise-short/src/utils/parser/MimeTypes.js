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

export default MimeTypes;
