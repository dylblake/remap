import React from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useDomains } from "@hooks/Domains/useDomains";

const DomainTree: React.FC = () => {
  const [rowData, setRowData] = React.useState([]);
  const [colDefs, setColDefs] = React.useState([
    { headerName: "Name", field: "name" },
    { headerName: "UUID", field: "uuid" },
    { headerName: "Middle Service ID", field: "middle_service_id" },
    { headerName: "Upper Service ID", field: "upper_service_id" },
    { headerName: "Level", field: "level" },
    { headerName: "Order", field: "order" },
    { headerName: "Created At", field: "created_at" },
    { headerName: "Updated At", field: "updated_at" },
  ]);

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
