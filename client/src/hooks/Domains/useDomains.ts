import { useState, useEffect, useCallback } from "react";
import { fetchDomains } from "../../api/domain";
import { Domain } from "types/Domain";

export const useDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchDomainsData = useCallback(() => {
    setIsLoading(true);
    setIsRefetching(false);

    fetchDomains()
      .then((data) => {
        setDomains(data);
      })
      .catch(() => {
        setError("Failed to fetch domains");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const refetch = () => {
    setIsRefetching(true);

    fetchDomains()
      .then((data) => {
        setDomains(data);
      })
      .catch(() => {
        setError("Failed to refetch domains");
      })
      .finally(() => {
        setIsRefetching(false);
      });
  };

  useEffect(() => {
    fetchDomainsData();
  }, [fetchDomainsData]);

  return { domains, error, isLoading, isRefetching, refetch };
};
