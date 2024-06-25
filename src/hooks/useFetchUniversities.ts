import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { University } from '../components/Autocomplete';

const fetchUniversities = async (searchTerm: string): Promise<University[]> => {
  const url = searchTerm.trim()
    ? `http://universities.hipolabs.com/search?name=${searchTerm}`
    : 'http://universities.hipolabs.com/search';
  const response = await axios.get(url);
  return response.data;
};

const useFetchUniversities = (searchTerm: string, fetchAll: boolean) => {
  return useQuery<University[], Error>({
    queryKey: ['universities', searchTerm, fetchAll],
    queryFn: () => fetchUniversities(searchTerm),
    enabled: fetchAll || searchTerm.trim() !== '',
  });
};

export default useFetchUniversities;
