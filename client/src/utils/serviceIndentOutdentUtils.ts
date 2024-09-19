// GloDex/client/src/utils/serviceTreeUtils.ts
import { Service } from "../types/Service";

/*-----------------------------------IS FIRST CHILD-----------------------------------*/
export const isFirstChild = (service: Service, allServices: Service[]) => {
  if (service.upper_service_id) {
    const siblings = allServices.filter(
      (s) => s.upper_service_id === service.upper_service_id
    );
    return siblings[0]?.uuid === service.uuid;
  } else if (service.middle_service_id) {
    const siblings = allServices.filter(
      (s) => s.middle_service_id === service.middle_service_id
    );
    return siblings[0]?.uuid === service.uuid;
  }
  return false;
};

/*-----------------------------------CAN INDENT-----------------------------------*/
export const canIndent = (
  service: Service,
  level: string,
  allServices: Service[]
) => {
  return (
    level !== "lower" &&
    !isFirstChild(service, allServices) &&
    service.order !== 1
  );
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
/*-----------------------------------OUTDENT SERVICE-----------------------------------*/
export const outdentService = (
  services: Service[],
  serviceToOutdent: Service
): { updatedServices: Service[]; affectedServices: Service[] } => {
  let affectedServices: Service[] = [];
  let updatedServices = [...services];

  // ----- LOWER -> MIDDLE OUTDENT
  if (serviceToOutdent.level === "lower") {
    // Change the level of service A to middle
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "middle" as const,
          middle_service_id: null, // Clear middle_service_id
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
    const serviceToOutdentOrder = serviceToOutdent.order;

    // Find all lower rows that need to outdent as well
    updatedServices = updatedServices.map((service) => {
      if (service.order > serviceToOutdentOrder && service.level === "lower") {
        const updatedService = {
          ...service,
          level: "middle" as const, // Move from lower to middle
          middle_service_id: null, // Clear middle_service_id
          upper_service_id: serviceToOutdent.uuid, // Set upper_service_id to the outdented service's UUID
        };
        affectedServices.push(updatedService); // Tracks modified services
        return updatedService;
      }
      return service;
    });

    // Update service A to become upper level
    updatedServices = updatedServices.map((service) => {
      if (service.uuid === serviceToOutdent.uuid) {
        const updatedService = {
          ...service,
          level: "upper" as const,
          upper_service_id: null, // Clear upper_service_id
        };
        affectedServices.push(updatedService); // Tracks modified service
        return updatedService;
      }
      return service;
    });
  }

  // Return the updated services and affected services
  return { updatedServices, affectedServices };
};
