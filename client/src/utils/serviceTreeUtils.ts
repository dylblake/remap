// GloDex/client/src/utils/serviceTreeUtils.ts
import { Service } from "../types/Service";

// Helper function to get all children with middle_service_id equal to a parent service's uuid
export const getMiddleChildren = (
    parent: Service,
    allServices: Service[]
  ): Service[] => {
    return allServices.filter(
      (service) => service.middle_service_id === parent.uuid
    );
  };  

// Function to update services when indenting
export const indentService = (
    services: Service[],
    serviceToIndent: Service
  ): { updatedServices: Service[]; affectedServices: Service[] } => {
    let affectedServices: Service[] = [];
    let updatedServices = [...services];
  
    // Handle indenting an upper service to middle
    if (serviceToIndent.type === "upper") {
      // Update the type of the service to middle
      updatedServices = updatedServices.map((service) => {
        if (service.uuid === serviceToIndent.uuid) {
          const updatedService = { ...service, type: "middle" as const };
          affectedServices.push(updatedService); // Add to affected services
          return updatedService;
        }
        return service;
      });
  
      // Reassign all lower and middle services that belong to the indented service
      let reachedNextUpper = false;
      updatedServices = updatedServices.map((service) => {
        if (service.uuid === serviceToIndent.uuid) reachedNextUpper = true;
  
        if (service.type === "upper" && reachedNextUpper) return service; // Skip other upper services
  
        if (!reachedNextUpper && service.type !== "upper") {
          const updatedService = {
            ...service,
            upper_service_id: serviceToIndent.uuid,
          };
          affectedServices.push(updatedService); // Add to affected services
          return updatedService;
        }
  
        return service;
      });
    }
    // Handle indenting a middle service to lower
    else if (serviceToIndent.type === "middle") {
      const upperService = services
        .slice(0, services.indexOf(serviceToIndent))
        .reverse()
        .find((s) => s.type === "upper");
  
      if (upperService) {
        // Update the type of the service to lower and set upper_service_id
        updatedServices = updatedServices.map((service) => {
          if (service.uuid === serviceToIndent.uuid) {
            const updatedService = {
              ...service,
              type: "lower" as const,
              upper_service_id: upperService.uuid,
            };
            affectedServices.push(updatedService); // Add to affected services
            return updatedService;
          }
          return service;
        });
  
        let reachedNextMiddle = false;
        updatedServices = updatedServices.map((service) => {
          if (service.uuid === serviceToIndent.uuid) reachedNextMiddle = true;
  
          if (service.type === "middle" && reachedNextMiddle) return service; // Skip other middle services
  
          if (!reachedNextMiddle && service.type === "lower") {
            const updatedService = {
              ...service,
              middle_service_id: serviceToIndent.uuid,
            };
            affectedServices.push(updatedService); // Add to affected services
            return updatedService;
          }
          return service;
        });
      }
    }
  
    // Return the updated service list and the affected services
    return { updatedServices, affectedServices };
  };
  
// Function to update services when outdenting
export const outdentService = (
    services: Service[],
    serviceToOutdent: Service,
    getMiddleChildren: (parent: Service, allServices: Service[]) => Service[]
  ): { updatedServices: Service[]; affectedServices: Service[] } => {
    let affectedServices: Service[] = [];
    const middleChildren = getMiddleChildren(serviceToOutdent, services);
  
    const updatedServices = services.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        let updatedService;
        
        // Handle moving middle service to upper level
        if (serviceToOutdent.type === "middle") {
          updatedService = {
            ...service,
            type: "upper" as const,
            upper_service_id: undefined,  // Reset upper_service_id
          };
          affectedServices.push(updatedService);
          return updatedService;
        }
        // Handle moving lower service to middle level
        else if (serviceToOutdent.type === "lower") {
          updatedService = {
            ...service,
            type: "middle" as const,
            middle_service_id: undefined,  // Reset middle_service_id
          };
          affectedServices.push(updatedService);
          return updatedService;
        }
      }
  
      // Reset middle service's parent-child relationship when its parent is outdented
      if (middleChildren.includes(service)) {
        const updatedService = {
          ...service,
          type: "middle" as const,
          middle_service_id: undefined,  // Reset middle_service_id
        };
        affectedServices.push(updatedService);
        return updatedService;
      }
  
      return service;
    });
  
    return { updatedServices, affectedServices };
  };
  