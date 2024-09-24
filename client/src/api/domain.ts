import axiosInstance from "./axiosInstance";
import { Domain } from "types/Domain";

// Fetch all domains
export const fetchDomains = async (): Promise<Domain[]> => {
  try {
    const response = await axiosInstance.get("/domains");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the order of domains
export const updateDomainOrder = async (
  domains: { uuid: string; order: number }[]
) => {
  try {
    await axiosInstance.put("/domains/order", { domains });
  } catch (error) {
    throw error;
  }
};

// Update multiple domains
export const updateDomains = async (domains: Domain[]) => {
  try {
    const sanitizedDomains = domains.map((domain) => ({
      ...domain,
      middle_domain_id: domain.middle_domain_id || null, // Set undefined to null
      upper_domain_id: domain.upper_domain_id || null, // Set undefined to null
    }));

    console.log(
      "UUIDs before API call:",
      domains.map((s) => s.uuid)
    );
    const requestData = { domains: sanitizedDomains };
    console.log("Sending update request for domains:", requestData); // Log the sanitized request data

    const response = await axiosInstance.put("/domains/batch", requestData); // Send the request
    console.log("domains update response:", response.data); // Log the response data

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating domains:", error); // Log any error
    throw error; // Re-throw the error to be handled by the calling code
  }
};
