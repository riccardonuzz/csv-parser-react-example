import React, { useState } from 'react';
import Header from './components/Header/Header';
import PeopleTable from './components/PeopleTable/PeopleTable';
import SearchBar from './components/SearchBar/SearchBar';
import FileInfo from './components/FileInfo/FileInfo';
import usePeopleData from './hooks/usePeopleData';

export default () => {
  const [
    peopleData,
    fileInfo,
    setPeopleData,
  ] = usePeopleData();
  const [searchTerm, setSearchTerm] = useState('');

  const renderPanels = () => {
    if (peopleData && fileInfo) {
      return (
        <>
          <div className="left-container">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <PeopleTable
              peopleData={peopleData}
              setPeopleData={setPeopleData}
              searchTerm={searchTerm}
            />
          </div>
          <div className="right-container">
            <FileInfo fileInfo={fileInfo} />
          </div>
        </>
      );
    }

    return <>No file selected. Please, select a file by pressing the button on the right.</>;
  };

  return (
    <>
      <Header setPeopleData={setPeopleData} />
      <div className="container">
        {renderPanels()}
      </div>

    </>
  );
};
