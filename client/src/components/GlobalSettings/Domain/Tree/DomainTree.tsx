import React from "react";
import { useDomains } from "@hooks/Domains/useDomains";

const DomainTree: React.FC = () => {
  const {
    domains: initialDomains,
    // error,
    // isLoading,
    // isRefetching,
    // refetch,
  } = useDomains();

  return (
    <ul>
      {initialDomains.map((domain) => (
        <li key={domain.uuid}>{domain.name}</li>
      ))}
    </ul>
  );
};
export default DomainTree;
