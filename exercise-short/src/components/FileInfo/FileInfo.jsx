import React from 'react';
import PropTypes, { string } from 'prop-types';

import './FileInfo.scss';

const FileInfo = ({ fileInfo }) => (
  <div className="file-info-container">
    <div><b>File informations</b></div>
    <div>
      Name:
      {` ${fileInfo.name}`}
    </div>
    <div>
      Size:
      {` ${fileInfo.size} Bytes`}
    </div>
    <div>
      Type:
      {` ${fileInfo.type || 'Not available'}`}
    </div>
  </div>
);

FileInfo.propTypes = {
  fileInfo: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
    lastModifiedDate: string,
    lastModified: PropTypes.number,
    webkitRelativePath: PropTypes.string,
  }).isRequired,
};

export default FileInfo;
