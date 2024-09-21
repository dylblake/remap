import { Service } from "../types/Service";

export function findNextService(
  services: Service[],
  currentOrder: number,
  direction: "up" | "down",
  targetLevel: "upper" | "middle" | "lower"
): Service | null {
  // Sort services by their order in ascending order
  const sortedServices = services.sort((a, b) => a.order - b.order);

  // Find the index of the current service
  const currentIndex = sortedServices.findIndex(
    (service) => service.order === currentOrder
  );

  // If the current service is not found, return null
  if (currentIndex === -1) return null;

  // Determine the search range based on direction
  const searchRange =
    direction === "up"
      ? sortedServices.slice(0, currentIndex).reverse() // Go upwards in order
      : sortedServices.slice(currentIndex + 1); // Go downwards in order

  // Find the next service that matches the target level
  const nextService = searchRange.find(
    (service) => service.level === targetLevel
  );

  // Return the next service object, or null if not found
  return nextService || null;
}

export function findNextServiceGroup(
  services: Service[],
  currentOrder: number,
  direction: "up" | "down",
  targetLevel: "upper" | "middle" | "lower"
): Service[] {
  // Sort services by their order in ascending order
  const sortedServices = services.sort((a, b) => a.order - b.order);

  // Find the index of the current service
  const currentIndex = sortedServices.findIndex(
    (service) => service.order === currentOrder
  );

  // If the current service is not found, return an empty array
  if (currentIndex === -1) return [];

  // Determine the search range based on direction
  const searchRange =
    direction === "up"
      ? sortedServices.slice(0, currentIndex).reverse() // Go upwards in order
      : sortedServices.slice(currentIndex + 1); // Go downwards in order

  // Collect consecutive services of the target level
  const consecutiveServices: Service[] = [];

  for (const service of searchRange) {
    if (service.level === targetLevel) {
      consecutiveServices.push(service); // Add to the result array if level matches
    } else {
      break; // Stop if a service does not match the target level
    }
  }

  // Return the array of consecutive services
  return consecutiveServices;
}
