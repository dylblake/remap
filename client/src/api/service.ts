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

// Update multiple services
export const updateServices = async (services: Service[]) => {
  try {
    console.log("Sending update request for services:", services); // Add log to check services data
    const response = await axiosInstance.put('/services/batch', { services });
    console.log("Services update response:", response.data); // Add log to confirm success
    return response.data;
  } catch (error) {
    console.error("Error updating services:", error); // Add log to check error
    throw error;
  }
};