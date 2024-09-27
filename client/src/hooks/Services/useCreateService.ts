import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Service } from "../../types/Service";

interface CreateServiceResponse {
  service: Service | null;
  error: string | null;
  isLoading: boolean;
  createService: (serviceData: Omit<Service, "uuid">) => Promise<void>;
}

const useCreateService = (): CreateServiceResponse => {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createService = (serviceData: Omit<Service, "uuid">): Promise<void> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      axiosInstance
        .post<Service>("/services", serviceData)
        .then((response) => {
          setService(response.data);
          setError(null);
          resolve();
        })
        .catch((err) => {
          console.error("Error creating service:", err);
          setService(null);
          setError(
            "There was an error creating the service. Please try again."
          );
          reject(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return {
    service,
    error,
    isLoading,
    createService,
  };
};

export default useCreateService;
