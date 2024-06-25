import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import useFetchUniversities from '../../hooks/useFetchUniversities';
import { University } from './Autocomplete.types';

const Autocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 300);
  const { data, isLoading, isError } = useFetchUniversities(debouncedInputValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


  return (
    <div className="fixed top-20 left-0 flex flex-col items-center justify-center w-full bg-white">
      <h1 className="text-black text-3xl font-bold mb-8">University Search</h1>
      <div className="w-full px-4 flex justify-center">
        <div className="w-full px-4 flex justify-center">
        <input
          className="w-full max-w-md px-4 py-2 border rounded-md border-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Search for a university..."
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      
      </div>
      {inputValue && ( 
        <div className="relative w-full flex justify-center">
          <ul className="absolute w-full max-w-md bg-white border rounded shadow-lg max-h-60 overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center w-full h-full">
                Loading ...
              </div>
            )}
            {isError && <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black">Error fetching data</p>}
            {!isLoading && !isError && data?.length === 0 && (
              <p className="px-4 py-2 text-red-500">No results found for "{inputValue}"</p>
            )}
            {data?.map((university: University, index: number) => (
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black" key={index}>
                {university.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
