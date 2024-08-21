// client/src/components/ServiceList.tsx
import React, { useEffect, useState } from "react";
import { fetchServices } from "../api/service";
import { Service } from "../types/Service";

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        setError("Failed to load services");
      }
    };

    loadServices();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Service List</h1>
      <ul>
        {services.map((service) => (
          <li key={service.uuid}>
            {service.name} - Type: {service.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
