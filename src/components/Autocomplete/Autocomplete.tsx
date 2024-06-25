import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { University, useFetchUniversities, ArrowDropDownIcon, ClearIcon } from './';

const Autocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 300);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fetchAll, setFetchAll] = useState(false);

  const { data, isLoading, isError } = useFetchUniversities(debouncedInputValue, fetchAll);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setDropdownVisible(value.length > 0);
    setFetchAll(false);
  };

  const toggleDropdownVisibility = () => {
    if (!dropdownVisible && inputValue === '') {
      setFetchAll(true); // Déclenche le chargement complet si l'input est vide
    }
    setDropdownVisible(prev => !prev);
  };

  const clearInput = () => {
    setInputValue('');
    setFetchAll(true);
    setDropdownVisible(false);
  };

  const selectUniversity = (university: University) => {
    setInputValue(university.name);
    setDropdownVisible(false);
  };

  const highlightMatch = (text: string, highlight: string, country: string) => {
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span style={{ fontWeight: 'bold' }}>{text.substring(index, index + highlight.length)}</span>
        {text.substring(index + highlight.length)}
        <span className="text-gray-500 ml-1">({country})</span>
      </>
    );
  };

  return (
    <div className="fixed top-20 left-0 flex flex-col items-center justify-center w-full">
      <h1 className="text-black text-3xl font-thin font-serif mb-8">University Search</h1>
      <div className="w-full px-4 flex justify-center">
        <div className="w-full max-w-md relative flex items-center">
          <input
            className="w-full px-4 py-2 focus:outline-none rounded-xl border-gray-300 pr-10 transition duration-300 ease-in-out hover:border-violet-300 border-2"
            placeholder="Search for a university..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="absolute right-0 pr-2 flex items-center space-x-2">
            {inputValue.length > 0 && (
              <ClearIcon
                className="h-5 w-5 text-gray-400 cursor-pointer"
                onClick={clearInput}
              />
            )}
            <ArrowDropDownIcon
              className={`h-5 w-5 text-gray-400 cursor-pointer transform transition-transform duration-300 ${
                dropdownVisible ? 'rotate-180' : 'rotate-0'
              }`}
              onClick={toggleDropdownVisibility}
            />
          </div>
        </div>
      </div>
      {(dropdownVisible && (inputValue || fetchAll)) && (
        <div className="relative w-full flex justify-center">
          <ul className="absolute w-full max-w-md bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                Loading ...
              </div>
            )}
            {isError && <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black">Error fetching data</p>}
            {!isLoading && !isError && data?.length === 0 && (
              <p className="px-4 py-2 text-red-500">
                  No results found for <span className="text-gray-600 font-thin font-serif">"{inputValue}"</span>
              </p>
            )}
            {data?.map((university: University, index: number) => (
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                key={index}
                onClick={() => selectUniversity(university)}
              >
                {highlightMatch(university.name, inputValue, university.country)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
