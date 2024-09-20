// GloDex/client/src/utils/serviceTreeUtils.ts
import { Service } from "../types/Service";

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

  // ----- UPPER -> MIDDLE INDENT
  if (serviceToIndent.level === "upper") {
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToIndent.uuid) {
        //Update service new middle level
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null,
        };
        affectedServices.push(updatedService); // Tracks modified services
        return updatedService;
      }
      return service;
    });

    const serviceToIndentOrder = serviceToIndent.order;

    // Find the preceding upper service in service order
    const precedingUpper = services.find(
      (s) => s.level === "upper" && s.order < serviceToIndentOrder
    );
    //If preceding upper exists, update all affected services' upper_service_id to preceding upper uuid
    if (precedingUpper) {
      updatedServices = updatedServices.map((service) => {
        if (service.upper_service_id === serviceToIndent.uuid) {
          const updatedService = {
            ...service,
            upper_service_id: precedingUpper.uuid,
          };
          affectedServices.push(updatedService); //Tracks modified services
          return updatedService;
        }
        return service;
      });
    }

    // Find proceeding lower services and update their middle_service_id with the indented service's uuid
    updatedServices = updatedServices.map((service) => {
      if (service.order > serviceToIndentOrder && service.level === "lower") {
        const updatedService = {
          ...service,
          middle_service_id: serviceToIndent.uuid,
        };
        affectedServices.push(updatedService); // Tracks modified services
        return updatedService;
      }
      return service;
    });
  }

  // ----- MIDDLE -> LOWER INDENT
  if (serviceToIndent.level === "middle") {
    //Find preceding middle service in service order
    const precedingMiddle = services.find(
      (s) => s.level === "middle" && s.order < serviceToIndent.order
    );

    if (precedingMiddle) {
      //If preceding middle exists,
      updatedServices = updatedServices.map((service) => {
        if (service.middle_service_id === serviceToIndent.uuid) {
          const updatedService = {
            ...service,
            middle_service_id: precedingMiddle.uuid,
          };
          affectedServices.push(updatedService); // Tracks modified services
          return updatedService;
        }
        return service;
      });

      // Update service to new lower level
      updatedServices = updatedServices.map((service) => {
        if (service.uuid === serviceToIndent.uuid) {
          const updatedService = {
            ...service,
            level: "lower" as const,
            middle_service_id: precedingMiddle.uuid,
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

  // ----- LOWER -> MIDDLE OUTDENT
  if (serviceToOutdent.level === "lower") {
    // Change the level of the service to middle and null middle_service_id
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null,
        };
        affectedServices.push(updatedService); // Tracks modified service
        return updatedService;
      }
      return service;
    });

    const serviceToOutdentOrder = serviceToOutdent.order;

    // Find lower services that follow and update their middle_service_id
    updatedServices = updatedServices.map((service) => {
      if (service.order > serviceToOutdentOrder && service.level === "lower") {
        const updatedService = {
          ...service,
          middle_service_id: serviceToOutdent.uuid,
        };
        affectedServices.push(updatedService); // Tracks modified services
        return updatedService;
      }
      return service;
    });
  }

  // ----- MIDDLE -> UPPER OUTDENT
  if (serviceToOutdent.level === "middle") {
    // Update the middle service to become upper level
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "upper" as const,
          upper_service_id: null, // Clear upper_service_id
          middle_service_id: null, // Clear middle_service_id
        };
        affectedServices.push(updatedService); // Track modified service
        return updatedService;
      }
      return service;
    });

    // Only affect the immediate lower services of the outdented middle service
    for (
      let i = services.indexOf(serviceToOutdent) + 1;
      i < services.length;
      i++
    ) {
      const currentService = services[i];

      // Stop if we encounter the next middle or upper service
      if (
        currentService.level === "middle" ||
        currentService.level === "upper"
      ) {
        break;
      }

      // If it's a lower service, move it to middle level under the outdented service
      if (currentService.level === "lower") {
        const updatedService = {
          ...currentService,
          level: "middle" as const, // Promote to middle
          middle_service_id: null, // Clear middle_service_id
          upper_service_id: serviceToOutdent.uuid, // Set new upper_service_id
        };
        affectedServices.push(updatedService); // Track modified service
        updatedServices[i] = updatedService; // Update the service in the list
      }
    }
  }
  // Return the updated services and affected services
  return { updatedServices, affectedServices };
};
