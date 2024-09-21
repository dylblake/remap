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
    
    const sanitizedServices = services.map(service => ({
      ...service,
      middle_service_id: service.middle_service_id || null,  // Set undefined to null
      upper_service_id: service.upper_service_id || null,    // Set undefined to null
    }));
    
    console.log("UUIDs before API call:", services.map(s => s.uuid));
    const requestData = { services: sanitizedServices };
    console.log("Sending update request for services:", requestData);  // Log the sanitized request data

    const response = await axiosInstance.put('/services/batch', requestData);  // Send the request
    console.log("Services update response:", response.data);  // Log the response data

    return response.data;  // Return the response data
  } catch (error) {
    console.error("Error updating services:", error);  // Log any error
    throw error;  // Re-throw the error to be handled by the calling code
  }
};



