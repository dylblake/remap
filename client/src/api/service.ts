import axios from 'axios';
import { Service } from '../types/Service';

// Fetch all services
export const fetchServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get('/api/services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the order of services
export const updateServiceOrder = async (services: { uuid: string; order: number }[]) => {
  try {
    await axios.put('/api/services/order', { services });
  } catch (error) {
    throw error;
  }
};

// Update a single service
export const updateService = async (service: Service) => {
  try {
    const response = await axios.put(`/api/services/${service.uuid}`, service);
    return response.data;
  } catch (error) {
    throw error;
  }
};