import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import ServiceTreeRow from "./ServiceTreeRow";
import ServiceTreeToolbar from "./ServiceTreeToolbar";
import { useServices } from "../../../hooks/useServices";

const ServiceTree: React.FC = () => {
  const { services, error, isLoading, isRefetching } = useServices();
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setExpandedServices(new Set());
  }, [services]);

  const handleToggle = (uuid: string) => {
    setExpandedServices((prev) =>
      prev.has(uuid)
        ? new Set([...prev].filter((id) => id !== uuid))
        : new Set(prev.add(uuid))
    );
  };

  const handleToggleExpandCollapse = () => {
    if (expandedServices.size === services.length) {
      setExpandedServices(new Set()); // Collapse all
    } else {
      const allIds = services.map((service) => service.uuid);
      setExpandedServices(new Set(allIds)); // Expand all
    }
  };

  const isAllExpanded = expandedServices.size === services.length;

  // Organize services into hierarchical structure
  const upperServices = services.filter((service) => !service.upper_service_id);
  const middleServices = (upperId: string) =>
    services.filter(
      (service) =>
        service.upper_service_id === upperId && !service.middle_service_id
    );
  const lowerServices = (middleId: string) =>
    services.filter((service) => service.middle_service_id === middleId);

  return (
    <Box p={4}>
      <ServiceTreeToolbar
        isAllExpanded={isAllExpanded}
        onToggleExpandCollapse={handleToggleExpandCollapse}
      />
      {isLoading && !isRefetching ? (
        <Spinner size="lg" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          Error: {error}
        </Alert>
      ) : services.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th alignContent="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {upperServices.map((upperService) => (
              <React.Fragment key={upperService.uuid}>
                <ServiceTreeRow
                  service={upperService}
                  isExpanded={expandedServices.has(upperService.uuid)}
                  onToggle={() => handleToggle(upperService.uuid)}
                  level="upper"
                  allServices={services}
                />
                {expandedServices.has(upperService.uuid) &&
                  middleServices(upperService.uuid).map((middleService) => (
                    <React.Fragment key={middleService.uuid}>
                      <ServiceTreeRow
                        service={middleService}
                        isExpanded={expandedServices.has(middleService.uuid)}
                        onToggle={() => handleToggle(middleService.uuid)}
                        level="middle"
                        allServices={services}
                      />
                      {expandedServices.has(middleService.uuid) &&
                        lowerServices(middleService.uuid).map(
                          (lowerService) => (
                            <ServiceTreeRow
                              key={lowerService.uuid}
                              service={lowerService}
                              level="lower"
                              allServices={services}
                            />
                          )
                        )}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text textAlign="center" color="gray.500">
          No services available.
        </Text>
      )}
    </Box>
  );
};

export default ServiceTree;
