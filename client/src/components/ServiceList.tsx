import React from "react";
import { useServices } from "../hooks/useServices";
import { Service } from "../types/Service";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
} from "@chakra-ui/react";
import DeleteIcon from "./DeleteIcon";

const ServiceList: React.FC = () => {
  const { services, error, isLoading, isRefetching, refetch } = useServices();

  if (isLoading && !isRefetching) return <Spinner size="lg" />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        Error: {error}
      </Alert>
    );

  return (
    <Box p={4}>
      {services.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th
                fontSize="xs"
                fontWeight="bold"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wider"
                lineHeight="1.2"
                paddingBottom="4px"
                textAlign="left"
              >
                Name
              </Th>
              <Th textAlign="center" paddingBottom="4px">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {services.map((service: Service) => (
              <Tr key={service.uuid}>
                <Td>{service.name}</Td>
                <Td>
                  <Flex justify="center">
                    <DeleteIcon uuid={service.uuid} onSuccess={refetch} />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text textAlign="center" color="gray.500">
          No services available.
        </Text>
      )}
    </Box>
  );
};

export default ServiceList;
