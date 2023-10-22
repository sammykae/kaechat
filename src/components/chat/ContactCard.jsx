import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";
import NotificationBadge from "react-notification-badge";
import Effect from "react-notification-badge";

const ContactCard = ({
  avatar,
  count,
  chatName,
  content,
  username,
  selectedChat,
  setSelectedChat,
  setNotification,
  notification,
  chat,
}) => {
  return (
    <Box
      onClick={() => {
        setNotification(notification.filter((n) => n.chat._id !== chat._id));
        setSelectedChat(chat);
      }}
      cursor="pointer"
      bg={selectedChat === chat ? "orange.600" : "#E8E8E8"}
      color={selectedChat === chat ? "white" : "black"}
      px={3}
      py={2}
      display={"flex"}
      columnGap={3}
      alignItems={"center"}
      borderRadius="lg"
      key={chat._id}
    >
      <Avatar size="sm" name={chatName} src={avatar} />

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        columnGap={20}
        flexGrow={1}
      >
        <Box>
          <Text>{chatName}</Text>
          {chat.latestMessage && (
            <Text fontSize="xs">
              <b>{username} : </b>
              {content}
            </Text>
          )}
        </Box>
      </Box>
      <Box>
        <NotificationBadge count={count} effect={Effect.SCALE} />
      </Box>
    </Box>
  );
};

export default ContactCard;
