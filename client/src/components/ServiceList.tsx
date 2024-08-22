import React from "react";
import { useServices } from "../hooks/useServices"; // Use named import
import { Service } from "../types/Service"; // Import the Service type

const ServiceList: React.FC = () => {
  const { services, error, isLoading } = useServices();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {services.length > 0 ? (
        services.map((service: Service) => (
          <div key={service.uuid}>
            <h3>{service.name}</h3>
            <p>Type: {service.type}</p>
          </div>
        ))
      ) : (
        <p>No services available.</p>
      )}
    </div>
  );
};

export default ServiceList;
