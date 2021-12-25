import React from "react";
import { Select, Button, Box, Fade, useDisclosure, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

export default function ChakraComponent() {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <h2>Chakra UI</h2>
      <Select placeholder="Select option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      <hr />
      <Button onClick={onToggle}>Click Me</Button>
      <Fade in={isOpen}>
        <Box p="40px" color="white" mt="4" bg="teal.500" rounded="md" shadow="md">
          Fade
        </Box>
      </Fade>

      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton isActive={isOpen} as={Button} rightIcon={<span>{1234}</span>}>
              {isOpen ? "Close" : "Open"}
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem onClick={() => alert("Kagebunshin")}>Create a Copy</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
}
