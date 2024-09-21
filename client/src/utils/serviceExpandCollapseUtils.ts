import { Service } from "../types/Service";

export const serviceHasChildren = (
  service: Service,
  allServices: Service[]
): boolean => {
  return allServices.some(
    (s) =>
      (service.level === "upper" &&
        s.level === "middle" &&
        s.upper_service_id === service.uuid) ||
      (service.level === "middle" &&
        s.level === "lower" &&
        s.middle_service_id === service.uuid)
  );
};

export const updateExpandedServicesAfterIndentOutdent = (
  expandedServices: Set<string>,
  affectedServices: Service[],
  actionType: "indent" | "outdent"
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
      if (serviceHasChildren(service, affectedServices)) {
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
