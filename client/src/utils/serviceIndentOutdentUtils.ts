import { Service } from "../types/Service";
import { findNextService } from "./serviceGeneralUtils";

/*-----------------------------------CAN INDENT-----------------------------------*/
export const canIndent = (
  service: Service,
  allServices: Service[]
): boolean => {
  const level = service.level;

  // First service in the order can't indent
  const currentServiceIndex = allServices.findIndex(
    (s) => s.uuid === service.uuid
  );
  if (currentServiceIndex === 0) {
    return false;
  }

  // Lower-level services can't indent
  if (level === "lower") {
    return false;
  }

  // Middle-level services directly below an upper service can't indent
  const previousService = allServices[currentServiceIndex - 1];
  if (level === "middle" && previousService?.level === "upper") {
    return false;
  }

  // All other services can indent
  return true;
};

/*-----------------------------------CAN OUTDENT-----------------------------------*/
export const canOutdent = (service: Service): boolean => {
  const level = service.level;
  return level !== "upper";
};

/*-----------------------------------INDENT SERVICE-----------------------------------*/
export const indentService = (
  services: Service[],
  serviceToIndent: Service
): { updatedServices: Service[]; affectedServices: Service[] } => {
  let affectedServices: Service[] = [];
  let updatedServices = [...services];

  const serviceToIndentOrder = serviceToIndent.order;

  // ----- UPPER -> MIDDLE INDENT
  if (serviceToIndent.level === "upper") {
    // Find the preceding upper service using findNextService
    const precedingUpperService = findNextService(
      services,
      serviceToIndentOrder,
      "up",
      "upper"
    );

    if (!precedingUpperService) {
      // Cannot indent if there is no preceding upper service
      return { updatedServices, affectedServices };
    }

    // Update the service being indented
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToIndent.uuid) {
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null,
          upper_service_id: precedingUpperService.uuid,
        };
        affectedServices.push(updatedService); // Tracks modified services
        return updatedService;
      }
      return service;
    });

    // No need to update children in this case
  }

  // ----- MIDDLE -> LOWER INDENT
  else if (serviceToIndent.level === "middle") {
    // Find the preceding middle service using findNextService
    const precedingMiddleService = findNextService(
      services,
      serviceToIndentOrder,
      "up",
      "middle"
    );

    if (!precedingMiddleService) {
      // Cannot indent if there is no preceding middle service
      return { updatedServices, affectedServices };
    }

    // Update the service being indented
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToIndent.uuid) {
        const updatedService = {
          ...service,
          level: "lower" as const,
          middle_service_id: precedingMiddleService.uuid,
          upper_service_id: service.upper_service_id,
        };
        affectedServices.push(updatedService); // Track modified service
        return updatedService;
      }
      return service;
    });
  }

  // Return the updated service list and the affected services
  return { updatedServices, affectedServices };
};

/*-----------------------------------OUTDENT SERVICE-----------------------------------*/
export const outdentService = (
  services: Service[],
  serviceToOutdent: Service
): { updatedServices: Service[]; affectedServices: Service[] } => {
  let affectedServices: Service[] = [];
  let updatedServices = [...services];

  // ----- LOWER -> MIDDLE OUTDENT
  if (serviceToOutdent.level === "lower") {
    // Update the service being outdented
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null,
          // Keep the same upper_service_id
        };
        affectedServices.push(updatedService); // Tracks modified service
        return updatedService;
      }
      return service;
    });

    // Update any lower-level children to point to the outdented service
    updatedServices = updatedServices.map((service) => {
      if (service.middle_service_id === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          upper_service_id: serviceToOutdent.upper_service_id,
          middle_service_id: serviceToOutdent.uuid,
        };
        affectedServices.push(updatedService);
        return updatedService;
      }
      return service;
    });
  }

  // ----- MIDDLE -> UPPER OUTDENT
  else if (serviceToOutdent.level === "middle") {
    // Update the service being outdented
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "upper" as const,
          upper_service_id: null,
          middle_service_id: null,
        };
        affectedServices.push(updatedService); // Track modified service
        return updatedService;
      }
      return service;
    });

    // Update any lower-level children to become middle-level under the outdented service
    updatedServices = updatedServices.map((service) => {
      if (service.middle_service_id === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "middle" as const, // Promote to middle level
          upper_service_id: serviceToOutdent.uuid,
          middle_service_id: null,
        };
        affectedServices.push(updatedService);
        return updatedService;
      }
      return service;
    });
  }

  // Return the updated services and affected services
  return { updatedServices, affectedServices };
};
