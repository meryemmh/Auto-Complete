import axios from 'axios';
import { University } from '../Autocomplete';

export const fetchUniversities = async (searchTerm: string): Promise<University[]> => {
  const url = searchTerm.trim() ? `http://universities.hipolabs.com/search?name=${searchTerm}` : 'http://universities.hipolabs.com/search';
  const response = await axios.get(url);
  return response.data;
};
