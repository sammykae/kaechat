import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = ({
  search,
  setSearch,
  handleSearch,
  loading,
  searchResult,
  loadingChat,
  isOpen,
  accessChat,
  onClose,
}) => {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
          <Box display="flex" pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              focusBorderColor="orange.600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((us) => (
              <UserListItem
                key={us._id}
                user={us}
                handleFunction={() => accessChat(us._id)}
              />
            ))
          )}
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
