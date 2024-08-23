import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Service } from "../types/Service";

interface CreateServiceResponse {
  service: Service | null;
  error: string | null;
  isLoading: boolean;
  createService: (serviceData: Omit<Service, 'uuid'>) => Promise<void>;
}

const useCreateService = (): CreateServiceResponse => {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createService = async (serviceData: Omit<Service, 'uuid'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<Service>("/services", serviceData);
      setService(response.data);
      setError(null);
    } catch (err) {
      console.error('Error creating service:', err);
      setService(null);
      setError("There was an error creating the service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    service,
    error,
    isLoading,
    createService,
  };
};

export default useCreateService;
