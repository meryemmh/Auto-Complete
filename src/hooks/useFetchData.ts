import { useState, useEffect } from 'react';
import { University } from '../components/Autocomplete';

function useFetchData(fetchFn: (searchTerm: string) => Promise<University[]>, searchTerm: string, fetchAll: boolean) {
  const [data, setData] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await fetchFn(searchTerm); 
        setData(result);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    if (searchTerm.trim() !== '' || fetchAll) {
      fetchData();
    }
  }, [fetchFn, searchTerm, fetchAll]);

  return { data, isLoading, isError };
}

export default useFetchData;
