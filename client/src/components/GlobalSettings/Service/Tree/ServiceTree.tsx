import React, { useState, useEffect, useCallback } from "react";
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
import { useServices } from "../../../../hooks/useServices";
import useCreateService from "../../../../hooks/useCreateService";
import useUpdateService from "../../../../hooks/useUpdateService";
import { useDeleteService } from "../../../../hooks/useDeleteService";
import {
  indentService,
  outdentService,
  getMiddleChildren,
} from "../../../../utils/serviceTreeUtils";
import { Service } from "../../../../types/Service";

const ServiceTree: React.FC = () => {
  const {
    services: initialServices,
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useServices();

  /* --------------------------STATE VARIABLES-------------------------- */
  const [services, setServices] = useState<Service[]>([]);
  const [modifiedServices, setModifiedServices] = useState<Set<string>>(
    new Set()
  );
  const [deletedServices, setDeletedServices] = useState<Set<string>>(
    new Set()
  ); // State for deleted services
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set()
  );
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { createService } = useCreateService();
  const { deleteService } = useDeleteService(); // Use the delete service hook

  useEffect(() => {
    setServices([...initialServices]); // Remove sorting after initial load
  }, [initialServices]);

  const isAllExpanded = expandedServices.size === services.length;

  const { updateServiceData } = useUpdateService();

  const handleToggle = useCallback(
    (uuid: string) => {
      setExpandedServices((prev) =>
        prev.has(uuid)
          ? new Set([...prev].filter((id) => id !== uuid))
          : new Set(prev.add(uuid))
      );
    },
    [expandedServices]
  );

  /* --------------------------HANDLE SAVE-------------------------- */
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Collect modified services
      const servicesToUpdate = Array.from(modifiedServices)
        .map((uuid) => services.find((service) => service.uuid === uuid))
        .filter((service) => service !== undefined) as Service[];

      // Update modified services
      if (servicesToUpdate.length > 0) {
        await updateServiceData(servicesToUpdate); // API call to update multiple services
      }

      // Create new services
      for (const service of services) {
        if (!service.uuid) {
          await createService(service); // API call to create
        }
      }

      // Delete services if necessary
      for (const uuid of deletedServices) {
        await deleteService(uuid);
      }

      setIsSaving(false);
      refetch(); // Reload the data from the server to reflect changes
      setModifiedServices(new Set()); // Clear modified services after saving
    } catch (error) {
      console.error("Error saving services:", error);
      setIsSaving(false);
    }
  }, [
    services,
    deletedServices,
    createService,
    updateServiceData,
    deleteService,
    refetch,
    modifiedServices, // Add modifiedServices to dependencies
  ]);
  /* --------------------------HANDLE TOGGLE EXPAND/COLLAPSE-------------------------- */
  const handleToggleExpandCollapse = useCallback(() => {
    if (expandedServices.size === services.length) {
      setExpandedServices(new Set()); // Collapse all
    } else {
      const allIds = services.map((service) => service.uuid);
      setExpandedServices(new Set(allIds)); // Expand all
    }
  }, [expandedServices, services]);

  /* --------------------------HANDLE UNDO-------------------------- */
  const handleUndo = useCallback(() => {
    // Implement undo logic
    setCanUndo(false);
  }, []);

  /* --------------------------HANDLE REDO-------------------------- */
  const handleRedo = useCallback(() => {
    // Implement redo logic
    setCanRedo(false);
  }, []);

  /* --------------------------HANDLE CREATE SERVICE-------------------------- */
  const handleCreateService = useCallback((newService: Service) => {
    setServices((prevServices) =>
      [...prevServices, newService].sort((a, b) => a.order - b.order)
    );
  }, []);

  /* --------------------------HANDLE DELETE SERVICE-------------------------- */
  const handleDeleteService = useCallback((uuid: string) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.uuid !== uuid)
    );
    setDeletedServices((prevDeleted) => new Set(prevDeleted).add(uuid)); // Track deleted services
  }, []);

  /* --------------------------HANDLE INDENT-------------------------- */
  const handleIndentService = useCallback(
    (uuid: string) => {
      setServices((prevServices) => {
        const serviceToIndent = prevServices.find(
          (service) => service.uuid === uuid
        );
        if (!serviceToIndent) return prevServices;

        // Debugging logs
        console.log("UUID to indent:", uuid);
        console.log(
          "Current upper_service_id:",
          serviceToIndent.upper_service_id
        );
        console.log(
          "Current middle_service_id:",
          serviceToIndent.middle_service_id
        );

        // Call the function that handles indent logic
        const { updatedServices, affectedServices } = indentService(
          prevServices,
          serviceToIndent
        );

        // Mark all affected services as modified (so they can be sent on save)
        setModifiedServices((prevModified) => {
          const updatedModified = new Set(prevModified);
          affectedServices.forEach((service) => {
            updatedModified.add(service.uuid);
          });
          return updatedModified;
        });

        return updatedServices;
      });
    },
    [setServices, setModifiedServices]
  );

  /* --------------------------HANDLE OUTDENT-------------------------- */
  const handleOutdentService = useCallback(
    (uuid: string) => {
      setServices((prevServices) => {
        const serviceToOutdent = prevServices.find(
          (service) => service.uuid === uuid
        );
        if (!serviceToOutdent) return prevServices;

        // Call the outdent logic
        const { updatedServices, affectedServices } = outdentService(
          prevServices,
          serviceToOutdent,
          getMiddleChildren
        );

        // Mark affected services as modified
        setModifiedServices((prevModified) => {
          const updatedModified = new Set(prevModified);
          affectedServices.forEach((service) => {
            updatedModified.add(service.uuid);
          });
          return updatedModified;
        });

        return updatedServices;
      });
    },
    [setServices, setModifiedServices, getMiddleChildren]
  );

  /* -------------------------------------------------------------------------- */
  /* --------------------------------JSX MARKUP-------------------------------- */
  /* -------------------------------------------------------------------------- */

  return (
    <Box p={4}>
      <ServiceTreeToolbar
        isAllExpanded={isAllExpanded}
        onToggleExpandCollapse={handleToggleExpandCollapse}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        onServiceCreated={handleCreateService} // Pass the callback
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
            </Tr>
          </Thead>
          <Tbody>
            {/* Render all services in their original array order */}
            {services.map((service) => (
              <ServiceTreeRow
                key={service.uuid}
                service={service}
                isExpanded={expandedServices.has(service.uuid)}
                onToggle={() => handleToggle(service.uuid)}
                level={service.type || "upper"} // Default to "upper" if service.type is undefined
                allServices={services}
                onDelete={handleDeleteService}
                onIndent={() => handleIndentService(service.uuid)}
                onOutdent={() => handleOutdentService(service.uuid)}
              />
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
