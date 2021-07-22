import React from 'react';
import PropTypes from 'prop-types';

import UploadButton from '../UploadButton/UploadButton';
import './Header.scss';

const Header = ({ setPeopleData }) => (
  <header>
    <div className="title">
      People data reader
    </div>
    <UploadButton setPeopleData={setPeopleData} />
  </header>
);

Header.propTypes = {
  setPeopleData: PropTypes.func.isRequired,
};

export default Header;
