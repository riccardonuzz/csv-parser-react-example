import { useState } from 'react';

const PEOPLE_DATA_KEY = 'people_data';
const FILE_INFO_KEY = 'file_info';

const usePeopleData = () => {
  let localStoragePeopleData = localStorage.getItem(PEOPLE_DATA_KEY) || null;
  let localStorageFileInfo = localStorage.getItem(FILE_INFO_KEY) || null;

  if (localStoragePeopleData) {
    localStoragePeopleData = JSON.parse(localStoragePeopleData);
    localStorageFileInfo = JSON.parse(localStorageFileInfo);
  }

  const [fileInfo, setFileInfo] = useState(localStorageFileInfo);
  const [peopleData, setPeopleData] = useState(localStoragePeopleData);

  const setPeopleDataWithLocalStorage = (data, fileData) => {
    setPeopleData(data);
    setFileInfo(fileData);
    localStorage.setItem(PEOPLE_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(FILE_INFO_KEY, JSON.stringify(fileData));
  };

  return [peopleData, fileInfo, setPeopleDataWithLocalStorage];
};

export default usePeopleData;
