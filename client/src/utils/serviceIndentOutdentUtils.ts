import { Service } from "../types/Service";
import { findNextService, findNextServiceGroup } from "./serviceGeneralUtils";

/*-----------------------------------CAN INDENT-----------------------------------*/
export const canIndent = (
  service: Service,
  level: string,
  allServices: Service[]
) => {
  //First service in the order can't indent
  const currentServiceIndex = allServices.findIndex(
    (s) => s.uuid === service.uuid
  );
  if (currentServiceIndex === 0) {
    return false;
  }

  //Lower-level services can't indent
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
export const canOutdent = (level: string) => {
  return level !== "upper";
};

/*-----------------------------------GET MIDDLE CHILDREN-----------------------------------*/
export const getMiddleChildren = (
  parent: Service,
  allServices: Service[]
): Service[] => {
  return allServices.filter(
    (service) => service.middle_service_id === parent.uuid
  );
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

    // Update the service being indented
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToIndent.uuid) {
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null,
          upper_service_id: precedingUpperService
            ? precedingUpperService.uuid
            : null,
        };
        affectedServices.push(updatedService); // Tracks modified services
        return updatedService;
      }
      return service;
    });

    // If preceding upper exists, update all services that had the indented service as their upper_service_id
    if (precedingUpperService) {
      updatedServices = updatedServices.map((service) => {
        if (service.upper_service_id === serviceToIndent.uuid) {
          const updatedService = {
            ...service,
            upper_service_id: precedingUpperService.uuid, // Update with found upper service UUID
          };
          affectedServices.push(updatedService); // Track modified services
          return updatedService;
        }
        return service;
      });
    }

    // Find the next group of lower services using findNextServiceGroup
    const lowerServicesGroup = findNextServiceGroup(
      services,
      serviceToIndentOrder,
      "down",
      "lower"
    );

    // Update the middle_service_id of the lower services to the indented service's UUID
    if (lowerServicesGroup.length > 0) {
      updatedServices = updatedServices.map((service) => {
        if (
          lowerServicesGroup.some(
            (lowerService) => lowerService.uuid === service.uuid
          )
        ) {
          const updatedService = {
            ...service,
            middle_service_id: serviceToIndent.uuid,
          };
          affectedServices.push(updatedService); // Track modified services
          return updatedService;
        }
        return service;
      });
    }
  }

  // ----- MIDDLE -> LOWER INDENT
  if (serviceToIndent.level === "middle") {
    // Find the preceding middle service using findNextService
    const precedingMiddleService = findNextService(
      services,
      serviceToIndentOrder,
      "up",
      "middle"
    );

    if (precedingMiddleService) {
      // Update services that had the indented service as their middle_service_id
      updatedServices = updatedServices.map((service) => {
        if (service.middle_service_id === serviceToIndent.uuid) {
          const updatedService = {
            ...service,
            middle_service_id: precedingMiddleService.uuid,
          };
          affectedServices.push(updatedService); // Tracks modified services
          return updatedService;
        }
        return service;
      });

      // Update the service being indented
      updatedServices = updatedServices.map((service) => {
        if (service.uuid === serviceToIndent.uuid) {
          const precedingUpperService = findNextService(
            services,
            service.order,
            "up",
            "upper"
          );
          const updatedService = {
            ...service,
            level: "lower" as const,
            middle_service_id: precedingMiddleService.uuid,
            upper_service_id: precedingUpperService
              ? precedingUpperService.uuid
              : null,
          };
          affectedServices.push(updatedService); // Track modified service
          return updatedService;
        }
        return service;
      });
    }
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

  const serviceToOutdentOrder = serviceToOutdent.order;

  // ----- LOWER -> MIDDLE OUTDENT
  if (serviceToOutdent.level === "lower") {
    // Update the service being outdented
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const findPrecedingUpperService = findNextService(
          services,
          serviceToOutdentOrder,
          "up",
          "upper"
        );
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null,
          upper_service_id: findPrecedingUpperService
            ? findPrecedingUpperService.uuid
            : null,
        };
        affectedServices.push(updatedService); // Tracks modified service
        return updatedService;
      }
      return service;
    });

    // Find the group of lower services following the outdented service
    const lowerServicesGroup = findNextServiceGroup(
      services,
      serviceToOutdentOrder,
      "down",
      "lower"
    );

    // Update their middle_service_id to the outdented service's UUID
    if (lowerServicesGroup.length > 0) {
      updatedServices = updatedServices.map((service) => {
        if (
          lowerServicesGroup.some(
            (lowerService) => lowerService.uuid === service.uuid
          )
        ) {
          const updatedService = {
            ...service,
            middle_service_id: serviceToOutdent.uuid,
          };
          affectedServices.push(updatedService); // Track modified services
          return updatedService;
        }
        return service;
      });
    }
  }

  // ----- MIDDLE -> UPPER OUTDENT
  if (serviceToOutdent.level === "middle") {
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

    // Find the group of lower services immediately following the outdented middle service
    const lowerServicesGroup = findNextServiceGroup(
      services,
      serviceToOutdentOrder,
      "down",
      "lower"
    );

    // Update these lower services to become middle level under the outdented service
    if (lowerServicesGroup.length > 0) {
      updatedServices = updatedServices.map((service) => {
        if (
          lowerServicesGroup.some(
            (lowerService) => lowerService.uuid === service.uuid
          )
        ) {
          const updatedService = {
            ...service,
            level: "middle" as const, // Promote to middle
            middle_service_id: null,
            upper_service_id: serviceToOutdent.uuid,
          };
          affectedServices.push(updatedService); // Track modified service
          return updatedService;
        }
        return service;
      });
    }
  }

  // Return the updated services and affected services
  return { updatedServices, affectedServices };
};
