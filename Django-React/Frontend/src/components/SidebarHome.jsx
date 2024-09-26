import React, { useState } from 'react';
import { Box, IconButton, VStack, Button, Text } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

function Sidebar({onDashboardClick,onApplicationsClick,onApplicationCreationClick}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  
  return (
    <Box position="relative">
      {/* Sidebar Toggle Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        icon={<HamburgerIcon />}
        onClick={toggleSidebar}

        position="fixed"
        top="1rem"
        left="1rem"
        zIndex="1000"
      />

      {/* Sidebar */}
      {isSidebarOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          height="100vh"
          width="250px"
          bg="gray.800"
          color="white"
          p="4"
          zIndex="999"
          boxShadow="lg"
        >
          {/* Close Button inside Sidebar */}
          <IconButton
            aria-label="Close Sidebar"
            icon={<CloseIcon />}
            onClick={toggleSidebar}
            bg="transparent"
            color="white"
            position="absolute"
            top="1rem"
            right="1rem"
          />

          <VStack spacing="4" mt="8">
            <Button variant="ghost" colorScheme="teal" onClick={onDashboardClick}>
              Dashboard
            </Button>
            <Button variant="ghost" colorScheme="teal" onClick={onApplicationsClick}>
              Applications
            </Button>
            <Button variant="ghost" colorScheme="teal" onClick={onApplicationCreationClick}>
              Create Application
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;