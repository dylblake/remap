import React, { useState } from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchBarProps {
  onSearch: (query: string) => void | Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleButtonClick = () => {
    onSearch(query);
  };

  return (
    <InputGroup size="lg">
      <Input
        pr="4.5rem"
        type="text"
        variant="filled"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleButtonClick}>
          <SearchIcon />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
