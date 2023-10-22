import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import SideDrawer from "./SideDrawer";
import Api from "../../utils/Api";
import { getSender } from "../../utils/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const Header = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const API = new Api();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    setLoading(true);

    API.searchChat(search)
      .then((res) => {
        setLoading(false);
        setSearchResult(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    API.accessChat(userId)
      .then((res) => {
        setLoadingChat(false);

        if (!chats.find((c) => c._id === res.data._id)) {
          setChats([res.data, ...chats]);
        }
        setSelectedChat(res.data);
        onClose();
      })
      .catch((err) => {
        setLoadingChat(false);
        toast({
          title: "Error Occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      });
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
      >
        <Button variant="ghost" colorScheme="orange" onClick={onOpen}>
          <Search2Icon />
          <Text display={{ base: "none", md: "flex" }} px={4}>
            Search User
          </Text>
        </Button>
        <Text
          display={{ base: "none", md: "flex" }}
          color={"orange.600"}
          fontSize="2xl"
          fontFamily="Work sans"
        >
          KAE-CHAT
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n.chat._id !== notif.chat._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `Group Message from ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Box display={"flex"} alignItems={"center"} columnGap={2}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.username}
                  src={user.avatar}
                />
                <Text>{user.username}</Text>
              </Box>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <SideDrawer
        handleSearch={handleSearch}
        isOpen={isOpen}
        loading={loading}
        loadingChat={loadingChat}
        onClose={onClose}
        onOpen={onOpen}
        search={search}
        searchResult={searchResult}
        accessChat={accessChat}
        setSearch={setSearch}
      />
    </>
  );
};

export default Header;
