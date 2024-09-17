import React, { useState, useEffect, useCallback } from "react";
const ServiceTree = () => {
  return <div>ServiceTrees</div>;
};

export default ServiceTree;

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Box,
//   Text,
//   Spinner,
//   Alert,
//   AlertIcon,
// } from "@chakra-ui/react";
// import ServiceTreeRow from "./ServiceTreeRow";
// import ServiceTreeToolbar from "./ServiceTreeToolbar";
// import { useServices } from "../../../../hooks/useServices";
// import useCreateService from "../../../../hooks/useCreateService";
// import useUpdateService from "../../../../hooks/useUpdateService";
// import { useDeleteService } from "../../../../hooks/useDeleteService";
// import { Service } from "../../../../types/Service";

// const ServiceTree: React.FC = () => {
//   const {
//     services: initialServices,
//     error,
//     isLoading,
//     isRefetching,
//     refetch,
//   } = useServices();
//   const [services, setServices] = useState<Service[]>([]);
//   const [modifiedServices, setModifiedServices] = useState<Set<string>>(
//     new Set()
//   );
//   const [deletedServices, setDeletedServices] = useState<Set<string>>(
//     new Set()
//   ); // State for deleted services
//   const [expandedServices, setExpandedServices] = useState<Set<string>>(
//     new Set()
//   );
//   const [canUndo, setCanUndo] = useState(false);
//   const [canRedo, setCanRedo] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const { createService } = useCreateService();
//   const { deleteService } = useDeleteService(); // Use the delete service hook

//   useEffect(() => {
//     setServices([...initialServices]); // Remove sorting after initial load
//   }, [initialServices]);

//   const isAllExpanded = expandedServices.size === services.length;

//   const { updateServiceData } = useUpdateService();

//   const handleToggle = useCallback(
//     (uuid: string) => {
//       setExpandedServices((prev) =>
//         prev.has(uuid)
//           ? new Set([...prev].filter((id) => id !== uuid))
//           : new Set(prev.add(uuid))
//       );
//     },
//     [expandedServices]
//   );

//   const handleToggleExpandCollapse = useCallback(() => {
//     if (expandedServices.size === services.length) {
//       setExpandedServices(new Set()); // Collapse all
//     } else {
//       const allIds = services.map((service) => service.uuid);
//       setExpandedServices(new Set(allIds)); // Expand all
//     }
//   }, [expandedServices, services]);

//   const handleSave = useCallback(async () => {
//     setIsSaving(true);
//     try {
//       // Collect modified services
//       const servicesToUpdate = Array.from(modifiedServices)
//         .map((uuid) => services.find((service) => service.uuid === uuid))
//         .filter((service) => service !== undefined) as Service[];

//       // Update modified services
//       if (servicesToUpdate.length > 0) {
//         await updateServiceData(servicesToUpdate); // API call to update multiple services
//       }

//       // Create new services
//       for (const service of services) {
//         if (!service.uuid) {
//           await createService(service); // API call to create
//         }
//       }

//       // Delete services if necessary
//       for (const uuid of deletedServices) {
//         await deleteService(uuid);
//       }

//       setIsSaving(false);
//       refetch(); // Reload the data from the server to reflect changes
//       setModifiedServices(new Set()); // Clear modified services after saving
//     } catch (error) {
//       console.error("Error saving services:", error);
//       setIsSaving(false);
//     }
//   }, [
//     services,
//     deletedServices,
//     createService,
//     updateServiceData,
//     deleteService,
//     refetch,
//     modifiedServices, // Add modifiedServices to dependencies
//   ]);

//   const handleUndo = useCallback(() => {
//     // Implement undo logic
//     setCanUndo(false);
//   }, []);

//   const handleRedo = useCallback(() => {
//     // Implement redo logic
//     setCanRedo(false);
//   }, []);

//   const handleServiceCreated = useCallback((newService: Service) => {
//     setServices((prevServices) =>
//       [...prevServices, newService].sort((a, b) => a.order - b.order)
//     );
//   }, []);

//   const handleDeleteService = useCallback((uuid: string) => {
//     setServices((prevServices) =>
//       prevServices.filter((service) => service.uuid !== uuid)
//     );
//     setDeletedServices((prevDeleted) => new Set(prevDeleted).add(uuid)); // Track deleted services
//   }, []);

//   // Helper function to get all children with middle_service_id equal to a parent service's uuid
//   const getMiddleChildren = (
//     parent: Service,
//     allServices: Service[]
//   ): Service[] => {
//     return allServices.filter(
//       (service) => service.middle_service_id === parent.uuid
//     );
//   };

//   const handleIndentService = useCallback(
//     async (uuid: string) => {
//       let affectedServices: Service[] = []; // Define affectedServices outside of setServices

//       setServices((prevServices) => {
//         const serviceToIndent = prevServices.find(
//           (service) => service.uuid === uuid
//         );
//         if (!serviceToIndent) return prevServices;

//         let updatedServices = [...prevServices];

//         if (serviceToIndent.type === "upper") {
//           // Indent upper service to middle
//           updatedServices = updatedServices.map((service) => {
//             if (service.uuid === serviceToIndent.uuid) {
//               const updatedService = { ...service, type: "middle" as const };
//               affectedServices.push(updatedService); // Track affected service
//               setModifiedServices((prev) => new Set(prev).add(service.uuid));
//               return updatedService;
//             }
//             return service;
//           });

//           // Update all lower and middle services until the next upper service
//           let reachedNextUpper = false;
//           updatedServices = updatedServices.map((service) => {
//             if (service.uuid === serviceToIndent.uuid) {
//               reachedNextUpper = true;
//             }
//             if (service.type === "upper" && reachedNextUpper) {
//               return service;
//             }
//             if (!reachedNextUpper && service.type !== "upper") {
//               const updatedService = {
//                 ...service,
//                 upper_service_id: serviceToIndent.uuid,
//               };
//               affectedServices.push(updatedService); // Track affected service
//               setModifiedServices((prev) => new Set(prev).add(service.uuid));
//               return updatedService;
//             }
//             return service;
//           });
//         } else if (serviceToIndent.type === "middle") {
//           // Indent middle service to lower under the nearest preceding upper service
//           const upperService = prevServices
//             .slice(0, prevServices.indexOf(serviceToIndent))
//             .reverse()
//             .find((s) => s.type === "upper");

//           if (upperService) {
//             updatedServices = updatedServices.map((service) => {
//               if (service.uuid === serviceToIndent.uuid) {
//                 const updatedService = {
//                   ...service,
//                   type: "lower" as const,
//                   upper_service_id: upperService.uuid,
//                 };
//                 affectedServices.push(updatedService); // Track affected service
//                 setModifiedServices((prev) => new Set(prev).add(service.uuid));
//                 return updatedService;
//               }
//               return service;
//             });

//             // Update all lower services until the next middle service
//             let reachedNextMiddle = false;
//             updatedServices = updatedServices.map((service) => {
//               if (service.uuid === serviceToIndent.uuid) {
//                 reachedNextMiddle = true;
//               }
//               if (service.type === "middle" && reachedNextMiddle) {
//                 return service;
//               }
//               if (!reachedNextMiddle && service.type === "lower") {
//                 const updatedService = {
//                   ...service,
//                   middle_service_id: serviceToIndent.uuid,
//                 };
//                 affectedServices.push(updatedService); // Track affected service
//                 setModifiedServices((prev) => new Set(prev).add(service.uuid));
//                 return updatedService;
//               }
//               return service;
//             });
//           }
//         }

//         console.log("Updated services after indent:", updatedServices);
//         return updatedServices;
//       });

//       try {
//         // Save all affected services to the backend using the hook
//         if (affectedServices.length > 0) {
//           await updateServiceData(affectedServices); // Pass the array of services
//         }
//       } catch (err) {
//         console.error("Failed to save service changes:", err);
//         // Optionally, notify the user
//         alert("Failed to save service changes. Please try again.");
//       }
//     },
//     [services, updateServiceData]
//   );

//   const handleOutdentService = useCallback(
//     async (uuid: string) => {
//       let affectedServices: Service[] = []; // Define affectedServices outside of setServices

//       setServices((prevServices) => {
//         const serviceToOutdent = prevServices.find(
//           (service) => service.uuid === uuid
//         );
//         if (!serviceToOutdent) return prevServices;

//         // Get all children that have middle_service_id equal to this service's uuid
//         const middleChildren = getMiddleChildren(
//           serviceToOutdent,
//           prevServices
//         );

//         // Outdent the parent service and any rows that have middle_service_id equal to the parent's uuid
//         const updatedServices = prevServices.map((service) => {
//           if (service.uuid === uuid) {
//             let updatedService;
//             // Update the parent service's hierarchy
//             if (serviceToOutdent.type === "middle") {
//               updatedService = {
//                 ...service,
//                 type: "upper" as const,
//                 upper_service_id: undefined, // Outdent to upper level
//               };
//               affectedServices.push(updatedService); // Track affected service
//               setModifiedServices((prev) => new Set(prev).add(service.uuid));
//               return updatedService;
//             }
//             if (serviceToOutdent.type === "lower") {
//               updatedService = {
//                 ...service,
//                 type: "middle" as const,
//                 middle_service_id: undefined, // Outdent lower to middle level
//               };
//               affectedServices.push(updatedService); // Track affected service
//               setModifiedServices((prev) => new Set(prev).add(service.uuid));
//               return updatedService;
//             }
//           }

//           // Outdent the children along with the parent
//           if (middleChildren.includes(service)) {
//             const updatedService = {
//               ...service,
//               type: "middle" as const, // Move children from lower to middle level
//               middle_service_id: undefined, // Clear middle_service_id as they're no longer in the middle level
//             };
//             affectedServices.push(updatedService); // Track affected service
//             setModifiedServices((prev) => new Set(prev).add(service.uuid));
//             return updatedService;
//           }

//           return service; // Keep all other services unchanged
//         });

//         console.log("Updated services after outdent:", updatedServices);
//         return updatedServices;
//       });

//       try {
//         // Save all affected services to the backend using the hook
//         if (affectedServices.length > 0) {
//           await updateServiceData(affectedServices); // Pass the array of services
//         }
//       } catch (err) {
//         console.error("Failed to save service changes:", err);
//         // Optionally, notify the user
//         alert("Failed to save service changes. Please try again.");
//       }
//     },
//     [services, updateServiceData]
//   );
//   return (
//     <Box p={4}>
//       <ServiceTreeToolbar
//         isAllExpanded={isAllExpanded}
//         onToggleExpandCollapse={handleToggleExpandCollapse}
//         onSave={handleSave}
//         onUndo={handleUndo}
//         onRedo={handleRedo}
//         canUndo={canUndo}
//         canRedo={canRedo}
//         isSaving={isSaving}
//         onServiceCreated={handleServiceCreated} // Pass the callback
//       />
//       {isLoading && !isRefetching ? (
//         <Spinner size="lg" />
//       ) : error ? (
//         <Alert status="error">
//           <AlertIcon />
//           Error: {error}
//         </Alert>
//       ) : services.length > 0 ? (
//         <Table variant="simple">
//           <Thead>
//             <Tr>
//               <Th>Name</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {/* Render all services in their original array order */}
//             {services.map((service) => (
//               <ServiceTreeRow
//                 key={service.uuid}
//                 service={service}
//                 isExpanded={expandedServices.has(service.uuid)}
//                 onToggle={() => handleToggle(service.uuid)}
//                 level={service.type || "upper"} // Default to "upper" if service.type is undefined
//                 allServices={services}
//                 onDelete={handleDeleteService}
//                 onIndent={() => handleIndentService(service.uuid)}
//                 onOutdent={() => handleOutdentService(service.uuid)}
//               />
//             ))}
//           </Tbody>
//         </Table>
//       ) : (
//         <Text textAlign="center" color="gray.500">
//           No services available.
//         </Text>
//       )}
//     </Box>
//   );
// };
// export default ServiceTree;
