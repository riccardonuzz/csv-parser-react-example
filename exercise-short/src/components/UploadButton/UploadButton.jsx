import React from 'react';
import PropTypes from 'prop-types';

import DataParser from '../../utils/parser/DataParser';
import './UploadButton.scss';

const UploadButton = ({ setPeopleData }) => {
  const onFileUpload = (changeEvent) => {
    changeEvent.persist();
    const reader = new FileReader();
    const file = changeEvent.target.files[0];
    reader.readAsText(file);
    reader.onload = (loadEvent) => {
      const dataParser = new DataParser(loadEvent.target.result, file);
      try {
        const parsedData = dataParser.parse();

        const fileInfo = {
          name: file.name,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate.toString(),
          webkitRelativePath: file.webkitRelativePath,
          size: file.size,
          type: file.type,
        };

        setPeopleData(parsedData, fileInfo);

        console.log(parsedData);
      } catch (error) {
        console.log('[Error]: ', error);
      }
    };
  };

  return (
    <>
      <label htmlFor="upload">
        Upload file
        <input type="file" id="upload" onChange={onFileUpload} accept=".csv" hidden />
      </label>
    </>
  );
};

UploadButton.propTypes = {
  setPeopleData: PropTypes.func.isRequired,
};

export default UploadButton;
