import { Service } from "../types/Service";

export const serviceHasChildren = (
  service: Service,
  allServices: Service[]
): boolean => {
  const hasChildren = allServices.some(
    (s) =>
      (service.level === "upper" &&
        s.level === "middle" &&
        s.upper_service_id === service.uuid) ||
      (service.level === "middle" &&
        s.level === "lower" &&
        s.middle_service_id === service.uuid)
  );
  console.log(
    `Service ${service.uuid} (${service.name}) hasChildren: ${hasChildren}`
  );
  return hasChildren;
};

export const updateExpandedServicesAfterIndentOutdent = (
  expandedServices: Set<string>,
  affectedServices: Service[],
  actionType: "indent" | "outdent",
  allServices: Service[] // Add this parameter
): Set<string> => {
  const newExpandedServices = new Set(expandedServices);

  affectedServices.forEach((service) => {
    if (actionType === "indent") {
      // If a service was indented, ensure its new parent is expanded
      if (service.level === "middle" && service.upper_service_id) {
        newExpandedServices.add(service.upper_service_id);
      } else if (service.level === "lower" && service.middle_service_id) {
        newExpandedServices.add(service.middle_service_id);
      }
    } else if (actionType === "outdent") {
      // If a service was outdented, ensure it is expanded if it has children
      if (serviceHasChildren(service, allServices)) {
        // Use allServices instead of affectedServices
        newExpandedServices.add(service.uuid);
      }
      // Also expand the service above it
      if (service.upper_service_id) {
        newExpandedServices.add(service.upper_service_id);
      }
    }
  });

  return newExpandedServices;
};
