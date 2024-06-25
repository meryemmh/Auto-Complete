import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { University } from '../components/Autocomplete/Autocomplete.types';

const fetchUniversities = async (searchTerm: string): Promise<University[]> => {
  const response = await axios.get(`http://universities.hipolabs.com/search?name=${searchTerm}`);
  return response.data;
};

const useFetchUniversities = (searchTerm: string) => {
  return useQuery<University[], Error>({
    queryKey: ['universities', searchTerm],
    queryFn: () => fetchUniversities(searchTerm),
    enabled: searchTerm.trim() !== '',
  });
};

export default useFetchUniversities;
