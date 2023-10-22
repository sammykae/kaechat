import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../utils/ChatLogics";
import ChatLoading from "../ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { ChatState } from "../../Context/ChatProvider";
import Api from "../../utils/Api";
import ContactCard from "./ContactCard";
import { Button } from "@chakra-ui/react";

const Contacts = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    const fetchChats = async () => {
      const API = new Api();
      API.getChats()
        .then((res) => {
          setChats(res.data);
        })
        .catch((err) => {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          setChats([]);
        });
    };
    fetchChats();
  }, [setChats, toast, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display={{ base: "block", sm: "flex" }}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text textAlign={{ base: "center", sm: "left" }}>Chats</Text>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats?.length < 1 && <Text>No chat to display</Text>}
        {chats ? (
          <Stack overflow={"auto"} overflowY="auto">
            {chats.map((chat) => (
              <ContactCard
                key={chat?._id}
                avatar={
                  chat?.isGroupChat
                    ? chat?.chatName
                    : getSenderFull(loggedUser, chat?.users).avatar
                }
                chat={chat}
                chatName={
                  chat.isGroupChat
                    ? chat?.chatName
                    : getSender(loggedUser, chat?.users)
                }
                content={
                  chat?.latestMessage?.content?.length > 50
                    ? chat?.latestMessage?.content.substring(0, 51) + "..."
                    : chat?.latestMessage?.content
                }
                count={
                  notification?.filter((n) => n.chat?._id === chat?._id).length
                }
                notification={notification}
                selectedChat={selectedChat}
                setNotification={setNotification}
                setSelectedChat={setSelectedChat}
                username={chat?.latestMessage?.sender?.username}
              />
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Contacts;
