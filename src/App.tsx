import React from 'react';
import { Autocomplete } from './components/Autocomplete';
import { fetchUniversities } from './components/utils/api'; 

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Autocomplete
        fetchFn={fetchUniversities} 
        options={[]} 
      />
    </div>
  );
};

export default App;
