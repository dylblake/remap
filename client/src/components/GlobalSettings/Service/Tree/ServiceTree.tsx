import React, { useState, useEffect, useCallback, useRef } from "react";
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
  useColorModeValue,
  Td,
} from "@chakra-ui/react";
import ServiceTreeRow from "./ServiceTreeRow";
import ServiceTreeToolbar from "./ServiceTreeToolbar";
import { useServices } from "../../../../hooks/Services/useServices";
import useCreateService from "../../../../hooks/Services/useCreateService";
import useUpdateService from "../../../../hooks/Services/useUpdateService";
import { useDeleteService } from "../../../../hooks/Services/useDeleteService";
import { Service } from "../../../../types/Service";
import {
  indentService,
  outdentService,
  canIndent,
  canOutdent,
} from "../../../../utils/serviceIndentOutdentUtils";
import {
  updateExpandedServicesAfterIndentOutdent,
  serviceHasChildren,
} from "../../../../utils/serviceExpandCollapseUtils";

const ServiceTree: React.FC = () => {
  // Fetch initial services from the API
  const {
    services: initialServices,
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useServices();

  /* --------------------------STATE VARIABLES-------------------------- */
  // Local state to manage services, modifications, deletions, expansions, etc.
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
  const [pendingAction, setPendingAction] = useState<{
    type: "indent" | "outdent";
    uuid: string;
  } | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasInitializedExpandedServices = useRef(false);

  // Refs for scrolling to the last actioned service
  const lastActionServiceUuid = useRef<string | null>(null);
  const serviceRefs = useRef<{
    [key: string]: HTMLTableRowElement | null;
  }>({});

  // Load initial services into local state when component mounts or updates
  useEffect(() => {
    setAllServicesState([...initialServices]);
  }, [initialServices]);

  // Initialize expanded services to expand all by default
  useEffect(() => {
    if (
      !hasInitializedExpandedServices.current &&
      allServicesState.length > 0
    ) {
      setExpandedServices(
        new Set(allServicesState.map((service) => service.uuid))
      );
      hasInitializedExpandedServices.current = true;
    }
  }, [allServicesState]);

  const { updateServiceData } = useUpdateService();
  const { createService } = useCreateService();
  const { deleteService } = useDeleteService();

  // Toggle expansion of a service
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
  // Save changes to the server
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
  // Toggle expansion or collapse of all services
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
  // Add a new service to the state
  const handleCreateService = useCallback((newService: Service) => {
    setAllServicesState((prevServices) => [...prevServices, newService]);
  }, []);

  /* --------------------------HANDLE DELETE SERVICE-------------------------- */
  // Delete a service from the state
  const handleDeleteService = useCallback((uuid: string) => {
    setAllServicesState((prevServices) =>
      prevServices.filter((service) => service.uuid !== uuid)
    );
    setDeletedServices((prevDeleted) => new Set(prevDeleted).add(uuid)); // Track deleted services
  }, []);

  /* --------------------------PERFORM INDENT SERVICE-------------------------- */
  // Indent a service (move it to a lower level)
  const performIndentService = useCallback(
    (uuid: string) => {
      setAllServicesState((prevServices) => {
        const serviceToIndent = prevServices.find(
          (service) => service.uuid === uuid
        );
        if (!serviceToIndent) return prevServices;

        const { updatedServices, affectedServices } = indentService(
          prevServices,
          serviceToIndent
        );

        const updatedServiceIds = affectedServices.map((s) => s.uuid);

        setModifiedServices((prevModified) => {
          const updatedModified = new Set(prevModified);
          updatedServiceIds.forEach((id) => updatedModified.add(id));
          return updatedModified;
        });

        // Update expandedServices after indent
        const newExpandedServices = updateExpandedServicesAfterIndentOutdent(
          expandedServices,
          affectedServices,
          "indent",
          updatedServices // Pass allServicesState
        );
        setExpandedServices(newExpandedServices);

        // Set the last action service UUID for scrolling
        lastActionServiceUuid.current = uuid;

        return updatedServices;
      });
    },
    [setAllServicesState, setModifiedServices, expandedServices]
  );

  /* --------------------------PERFORM OUTDENT SERVICE-------------------------- */
  // Outdent a service (move it to a higher level)
  const performOutdentService = useCallback(
    (uuid: string) => {
      setAllServicesState((prevServices) => {
        const serviceToOutdent = prevServices.find(
          (service) => service.uuid === uuid
        );
        if (!serviceToOutdent) return prevServices;

        const { updatedServices, affectedServices } = outdentService(
          prevServices,
          serviceToOutdent
        );

        const updatedServiceIds = affectedServices.map((s) => s.uuid);

        setModifiedServices((prevModified) => {
          const updatedModified = new Set(prevModified);
          updatedServiceIds.forEach((id) => updatedModified.add(id));
          return updatedModified;
        });

        // Update expandedServices after outdent
        const newExpandedServices = updateExpandedServicesAfterIndentOutdent(
          expandedServices,
          affectedServices,
          "outdent",
          updatedServices // Pass allServicesState
        );
        setExpandedServices(newExpandedServices);

        // Set the last action service UUID for scrolling
        lastActionServiceUuid.current = uuid;

        return updatedServices;
      });
    },
    [setAllServicesState, setModifiedServices, expandedServices]
  );

  /* --------------------------HANDLE INDENT-------------------------- */
  // Handle indent action
  const handleIndentService = useCallback(
    (uuid: string) => {
      const serviceIndex = allServicesState.findIndex(
        (service) => service.uuid === uuid
      );
      if (serviceIndex === -1) return;

      const serviceToIndent = allServicesState[serviceIndex];

      if (
        !expandedServices.has(serviceToIndent.uuid) &&
        serviceHasChildren(serviceToIndent, allServicesState)
      ) {
        // Expand the service and set pending indent
        setExpandedServices((prevExpanded) => {
          const newExpanded = new Set(prevExpanded);
          newExpanded.add(serviceToIndent.uuid);
          return newExpanded;
        });
        setPendingAction({ type: "indent", uuid });
      } else {
        // Proceed to indent immediately
        performIndentService(uuid);
      }
    },
    [allServicesState, expandedServices, performIndentService]
  );

  /* --------------------------HANDLE OUTDENT-------------------------- */
  // Handle outdent action
  const handleOutdentService = useCallback(
    (uuid: string) => {
      const serviceIndex = allServicesState.findIndex(
        (service) => service.uuid === uuid
      );
      if (serviceIndex === -1) return;

      const serviceToOutdent = allServicesState[serviceIndex];

      if (
        !expandedServices.has(serviceToOutdent.uuid) &&
        serviceHasChildren(serviceToOutdent, allServicesState)
      ) {
        // Expand the service and set pending outdent
        setExpandedServices((prevExpanded) => {
          const newExpanded = new Set(prevExpanded);
          newExpanded.add(serviceToOutdent.uuid);
          return newExpanded;
        });
        setPendingAction({ type: "outdent", uuid });
      } else {
        // Proceed to outdent immediately
        performOutdentService(uuid);
      }
    },
    [allServicesState, expandedServices, performOutdentService]
  );

  /* --------------------------USE EFFECT FOR PENDING ACTION-------------------------- */
  // Perform pending indent or outdent action after expansion
  useEffect(() => {
    if (pendingAction) {
      const { type, uuid } = pendingAction;
      const isExpanded = expandedServices.has(uuid);
      if (isExpanded) {
        if (type === "indent") {
          performIndentService(uuid);
        } else if (type === "outdent") {
          performOutdentService(uuid);
        }
        setPendingAction(null);
      }
    }
  }, [
    pendingAction,
    expandedServices,
    performIndentService,
    performOutdentService,
  ]);

  /* --------------------------GET VISIBLE SERVICES-------------------------- */
  // Get the list of services that should be visible based on expansion state
  const getVisibleServices = useCallback(() => {
    const visibleServices: Array<{
      service: Service;
      hasChildren: boolean;
      canIndent: boolean;
      canOutdent: boolean;
    }> = [];
    const parentVisibilityMap = new Map<string, boolean>();

    for (let i = 0; i < allServicesState.length; i++) {
      const service = allServicesState[i];

      let isVisible = true;
      if (service.level === "middle" && service.upper_service_id) {
        isVisible =
          parentVisibilityMap.get(service.upper_service_id) !== false &&
          expandedServices.has(service.upper_service_id);
      } else if (service.level === "lower" && service.middle_service_id) {
        isVisible =
          parentVisibilityMap.get(service.middle_service_id) !== false &&
          expandedServices.has(service.middle_service_id);
      }

      if (isVisible) {
        // Determine if the service has children
        const hasChildren = serviceHasChildren(service, allServicesState);

        // Determine if the service can be indented or outdented
        const canIndentState = canIndent(service, allServicesState);
        const canOutdentState = canOutdent(service);

        visibleServices.push({
          service,
          hasChildren,
          canIndent: canIndentState,
          canOutdent: canOutdentState,
        });
        parentVisibilityMap.set(service.uuid, true);
      } else {
        parentVisibilityMap.set(service.uuid, false);
      }
    }

    return visibleServices;
  }, [allServicesState, expandedServices]);

  // Scroll to the last indented/outdented service
  useEffect(() => {
    if (lastActionServiceUuid.current) {
      const element = serviceRefs.current[lastActionServiceUuid.current];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      lastActionServiceUuid.current = null;
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* --------------------------------JSX MARKUP-------------------------------- */
  /* -------------------------------------------------------------------------- */

  const visibleServices = getVisibleServices();
  const isAllExpanded = expandedServices.size === allServicesState.length;

  // Color variables for theming
  const tableBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("teal.600", "teal.800");
  const noDataTextColor = useColorModeValue("gray.500", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%" // Ensure full width
      bg={tableBg}
    >
      {/* Toolbar */}
      <Box
        bg={useColorModeValue("white", "gray.800")}
        position="sticky"
        top="0"
        zIndex={10} // Ensures it stays on top of the table
      >
        <ServiceTreeToolbar
          isAllExpanded={isAllExpanded}
          onToggleExpandCollapse={handleToggleExpandCollapse}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          isSaving={isSaving}
          onServiceCreated={handleCreateService}
        />
      </Box>

      {/* Table */}
      {isLoading && !isRefetching ? (
        <Box p={4} textAlign="center">
          <Spinner size="md" />
        </Box>
      ) : error ? (
        <Alert status="error" borderRadius="md" m={4}>
          <AlertIcon />
          Error: {error}
        </Alert>
      ) : allServicesState.length > 0 ? (
        <Box overflowX="auto">
          <Table
            variant="simple"
            borderRadius="md"
            // overflow="hidden"
            boxShadow="md"
            size="sm"
            width="100%"
          >
            <Thead bg={headerBg} position="sticky" top="0" boxShadow="sm">
              <Tr>
                <Th
                  fontSize="xs" // Smaller font
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="white"
                  letterSpacing="wider"
                >
                  Name
                </Th>
                {/* Placeholder Columns */}
                <Th
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="white"
                  letterSpacing="wider"
                >
                  Column 1
                </Th>
                <Th
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="white"
                  letterSpacing="wider"
                >
                  Column 2
                </Th>
                <Th
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="white"
                  letterSpacing="wider"
                >
                  Column 3
                </Th>
                {/* Action Column Header */}
                <Th
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="white"
                  letterSpacing="wider"
                  textAlign="right"
                >
                  Actions
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {/* Render only visible services */}
              {visibleServices.map(
                ({
                  service,
                  hasChildren,
                  canIndent: canIndentState,
                  canOutdent: canOutdentState,
                }) => (
                  <ServiceTreeRow
                    key={service.uuid}
                    service={service}
                    hasChildren={hasChildren}
                    isExpanded={expandedServices.has(service.uuid)}
                    onToggle={() => handleToggle(service.uuid)}
                    onDelete={handleDeleteService}
                    onIndent={() => handleIndentService(service.uuid)}
                    onOutdent={() => handleOutdentService(service.uuid)}
                    canIndent={canIndentState}
                    canOutdent={canOutdentState}
                    ref={(el) => (serviceRefs.current[service.uuid] = el)}
                    hoverBg={hoverBg} // Pass hoverBg for styling
                  >
                    {/* Placeholder Cells */}
                    <Td p={1}>
                      <Text fontSize="xs" color={noDataTextColor}>
                        {/* Future content */}
                      </Text>
                    </Td>
                    <Td p={1}>
                      <Text fontSize="xs" color={noDataTextColor}>
                        {/* Future content */}
                      </Text>
                    </Td>
                    <Td p={1}>
                      <Text fontSize="xs" color={noDataTextColor}>
                        {/* Future content */}
                      </Text>
                    </Td>
                  </ServiceTreeRow>
                )
              )}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box p={4}>
          <Text textAlign="center" color={noDataTextColor} fontSize="sm">
            No services available.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ServiceTree;
