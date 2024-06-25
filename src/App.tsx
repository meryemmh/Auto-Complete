import React from 'react';
import { Autocomplete } from './components/Autocomplete';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-50">
      <Autocomplete />
    </div>  
  );
};

export default App;
