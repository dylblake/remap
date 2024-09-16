import axiosInstance from './axiosInstance';
import { Service } from '../types/Service';

// Fetch all services
export const fetchServices = async (): Promise<Service[]> => {
  try {
    const response = await axiosInstance.get('/services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the order of services
export const updateServiceOrder = async (services: { uuid: string; order: number }[]) => {
  try {
    await axiosInstance.put('/services/order', { services });
  } catch (error) {
    throw error;
  }
};

// Update a single service
export const updateService = async (service: Service) => {
  try {
    const response = await axiosInstance.put(`/services/${service.uuid}`, service);
    return response.data;
  } catch (error) {
    throw error;
  }
};