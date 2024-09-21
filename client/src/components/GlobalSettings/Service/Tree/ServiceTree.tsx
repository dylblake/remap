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
  const [allServicesState, setAllServicesState] = useState<Service[]>([]);
  const [modifiedServices, setModifiedServices] = useState<Set<string>>(
    new Set()
  );
  const [deletedServices, setDeletedServices] = useState<Set<string>>(
    new Set()
  );
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set()
  );
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { createService } = useCreateService();
  const { deleteService } = useDeleteService();

  useEffect(() => {
    setAllServicesState([...initialServices]);
  }, [initialServices]);

  const { updateServiceData } = useUpdateService();

  const handleToggle = useCallback((uuid: string) => {
    setExpandedServices((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(uuid)) {
        newExpanded.delete(uuid);
      } else {
        newExpanded.add(uuid);
      }
      return newExpanded;
    });
  }, []);

  /* --------------------------HANDLE SAVE-------------------------- */
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Collect modified services
      const servicesToUpdate = Array.from(modifiedServices)
        .map((uuid) =>
          allServicesState.find((service) => service.uuid === uuid)
        )
        .filter((service) => service !== undefined) as Service[];

      // Update modified services
      if (servicesToUpdate.length > 0) {
        await updateServiceData(servicesToUpdate);
      }

      // Create new services
      for (const service of allServicesState) {
        if (!service.uuid) {
          await createService(service);
        }
      }

      // Delete services if necessary
      for (const uuid of deletedServices) {
        await deleteService(uuid);
      }

      setIsSaving(false);
      refetch();
      setModifiedServices(new Set());
    } catch (error) {
      console.error("Error saving services:", error);
      setIsSaving(false);
    }
  }, [
    allServicesState,
    deletedServices,
    createService,
    updateServiceData,
    deleteService,
    refetch,
    modifiedServices,
  ]);

  /* --------------------------HANDLE TOGGLE EXPAND/COLLAPSE-------------------------- */
  const handleToggleExpandCollapse = useCallback(() => {
    if (expandedServices.size === allServicesState.length) {
      setExpandedServices(new Set()); // Collapse all
    } else {
      const allIds = allServicesState.map((service) => service.uuid);
      setExpandedServices(new Set(allIds)); // Expand all
    }
  }, [expandedServices, allServicesState]);

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
    setAllServicesState((prevServices) => [...prevServices, newService]);
  }, []);

  /* --------------------------HANDLE DELETE SERVICE-------------------------- */
  const handleDeleteService = useCallback((uuid: string) => {
    setAllServicesState((prevServices) =>
      prevServices.filter((service) => service.uuid !== uuid)
    );
    setDeletedServices((prevDeleted) => new Set(prevDeleted).add(uuid)); // Track deleted services
  }, []);

  /* --------------------------HANDLE INDENT-------------------------- */
  const handleIndentService = useCallback(
    (uuid: string) => {
      setAllServicesState((prevServices) => {
        const index = prevServices.findIndex(
          (service) => service.uuid === uuid
        );
        if (index === -1) return prevServices;

        const serviceToIndent = prevServices[index];

        const newServices = [...prevServices];

        if (serviceToIndent.level === "upper") {
          for (let i = index - 1; i >= 0; i--) {
            const potentialParent = newServices[i];
            if (potentialParent.level === "upper") {
              serviceToIndent.level = "middle";
              serviceToIndent.upper_service_id = potentialParent.uuid;
              serviceToIndent.middle_service_id = null;
              break;
            }
          }
        } else if (serviceToIndent.level === "middle") {
          // Indent to lower
          // Find previous service at the same or higher level
          for (let i = index - 1; i >= 0; i--) {
            const potentialParent = newServices[i];
            if (potentialParent.level === "middle") {
              serviceToIndent.level = "lower";
              serviceToIndent.middle_service_id = potentialParent.uuid;
              break;
            }
          }
        }

        setModifiedServices((prevModified) => {
          const updatedModified = new Set(prevModified);
          updatedModified.add(serviceToIndent.uuid);
          return updatedModified;
        });

        return newServices;
      });
    },
    [setAllServicesState, setModifiedServices]
  );

  /* --------------------------HANDLE OUTDENT-------------------------- */
  const handleOutdentService = useCallback(
    (uuid: string) => {
      setAllServicesState((prevServices) => {
        const index = prevServices.findIndex(
          (service) => service.uuid === uuid
        );
        if (index === -1) return prevServices;

        const newServices = [...prevServices];

        const serviceToOutdent = newServices[index];

        // Function to recursively adjust levels and parent IDs
        const adjustLevelsOnOutdent = (
          service: Service,
          parentService: Service | null
        ) => {
          if (service.level === "middle") {
            service.level = "upper";
            service.upper_service_id = null;
            service.middle_service_id = null;
          } else if (service.level === "lower") {
            service.level = "middle";
            service.middle_service_id = null;
            service.upper_service_id = parentService
              ? parentService.uuid
              : null;
          }

          const children = newServices.filter(
            (s) =>
              (s.level === "lower" && s.middle_service_id === service.uuid) ||
              (s.level === "middle" && s.upper_service_id === service.uuid)
          );

          children.forEach((child) => {
            adjustLevelsOnOutdent(child, service);
          });
        };

        adjustLevelsOnOutdent(serviceToOutdent, null);

        setModifiedServices((prevModified) => {
          const updatedModified = new Set(prevModified);
          updatedModified.add(serviceToOutdent.uuid);
          return updatedModified;
        });

        return newServices;
      });
    },
    [setAllServicesState, setModifiedServices]
  );

  /* --------------------------GET VISIBLE SERVICES-------------------------- */
  const getVisibleServices = useCallback(() => {
    const visibleServices = [];
    const parentExpanded = new Map<string, boolean>();

    for (let i = 0; i < allServicesState.length; i++) {
      const service = allServicesState[i];

      let isVisible = true;
      if (service.level === "middle" && service.upper_service_id) {
        isVisible =
          parentExpanded.get(service.upper_service_id) !== false &&
          expandedServices.has(service.upper_service_id);
      } else if (service.level === "lower" && service.middle_service_id) {
        isVisible =
          parentExpanded.get(service.middle_service_id) !== false &&
          expandedServices.has(service.middle_service_id);
      }

      if (isVisible) {
        visibleServices.push(service);
        parentExpanded.set(service.uuid, true);
      } else {
        parentExpanded.set(service.uuid, false);
      }
    }

    return visibleServices;
  }, [allServicesState, expandedServices]);

  /* -------------------------------------------------------------------------- */
  /* --------------------------------JSX MARKUP-------------------------------- */
  /* -------------------------------------------------------------------------- */

  const visibleServices = getVisibleServices();
  const isAllExpanded = expandedServices.size === allServicesState.length;

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
      ) : allServicesState.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Render only visible services */}
            {visibleServices.map((service) => (
              <ServiceTreeRow
                key={service.uuid}
                service={service}
                isExpanded={expandedServices.has(service.uuid)}
                onToggle={() => handleToggle(service.uuid)}
                allServices={allServicesState}
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
