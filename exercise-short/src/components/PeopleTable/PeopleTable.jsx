import React from 'react';
import PropTypes from 'prop-types';

import './PeopleTable.scss';

const PeopleTable = ({ searchTerm, peopleData }) => {
  const renderPeopleTable = (peopleTableData) => peopleTableData.map((peopleRow, index) => {
    const row = peopleRow.map((peopleCell, cellIndex) => <div key={`row-${cellIndex}`} className="cell">{peopleCell || <div className="not-available">Not available</div>}</div>);
    return <div key={index} className="row">{row}</div>;
  });

  const renderFilteredPeopleTable = () => {
    const filteredPeopleDataWithoutHeaders = peopleData.slice(1);
    const filteredPeopleData = filteredPeopleDataWithoutHeaders.filter((peopleRow) => peopleRow[0].toLowerCase().includes(searchTerm.toLowerCase()));
    return renderPeopleTable([peopleData[0], ...filteredPeopleData]);
  };

  return (
    <div className="table-container">
      <div className="table">
        {!searchTerm ? renderPeopleTable(peopleData) : null}
        {searchTerm ? renderFilteredPeopleTable() : null}
      </div>
    </div>
  );
};

PeopleTable.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  peopleData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default PeopleTable;
