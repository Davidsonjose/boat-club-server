import axios from 'axios';

export const getUserLocation = async (ipAddress: string) => {
  return await axios.get(`http://ipwhois.app/json/${ipAddress}`);
};
