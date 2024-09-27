import { Domain } from "types/Domain"; // Adjust the path to your Domain type

export function findNextDomain(
  domains: Domain[],
  currentOrder: number,
  direction: "up" | "down",
  targetLevel: "upper" | "middle" | "lower"
): Domain | null {
  // Sort domains by their order in ascending order
  const sortedDomains = domains.sort((a, b) => a.order - b.order);

  // Find the index of the current domain
  const currentIndex = sortedDomains.findIndex(
    (domain) => domain.order === currentOrder
  );

  // If the current domain is not found, return null
  if (currentIndex === -1) return null;

  // Determine the search range based on direction
  const searchRange =
    direction === "up"
      ? sortedDomains.slice(0, currentIndex).reverse() // Go upwards in order
      : sortedDomains.slice(currentIndex + 1); // Go downwards in order

  // Find the next domain that matches the target level
  const nextDomain = searchRange.find((domain) => domain.level === targetLevel);

  // Return the next domain object, or null if not found
  return nextDomain || null;
}

export function findNextDomainGroup(
  domains: Domain[],
  currentOrder: number,
  direction: "up" | "down",
  targetLevel: "upper" | "middle" | "lower"
): Domain[] {
  // Sort domains by their order in ascending order
  const sortedDomains = domains.sort((a, b) => a.order - b.order);

  // Find the index of the current domain
  const currentIndex = sortedDomains.findIndex(
    (domain) => domain.order === currentOrder
  );

  // If the current domain is not found, return an empty array
  if (currentIndex === -1) return [];

  // Determine the search range based on direction
  const searchRange =
    direction === "up"
      ? sortedDomains.slice(0, currentIndex).reverse() // Go upwards in order
      : sortedDomains.slice(currentIndex + 1); // Go downwards in order

  // Collect consecutive domains of the target level
  const consecutiveDomains: Domain[] = [];

  for (const domain of searchRange) {
    if (domain.level === targetLevel) {
      consecutiveDomains.push(domain); // Add to the result array if level matches
    } else {
      break; // Stop if a domain does not match the target level
    }
  }

  // Return the array of consecutive domains
  return consecutiveDomains;
}
