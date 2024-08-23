import axios from 'axios';
import { Service } from '../types/Service'; 

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get('/api/services');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};

export const updateServices = async (services: Service[]) => {
  try {
    await axios.put('/api/services', { services });
  } catch (error) {
    console.error('Failed to update services:', error);
    throw error;
  }
};
