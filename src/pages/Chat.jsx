import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Header from "../components/chat/Header";
import Contacts from "../components/chat/Contacts";
import ChatContainer from "../components/chat/ChatContainer";
import { useState } from "react";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <Box w={"100%"}>
      {user && <Header />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        p={6}
        h={"90vh"}
        bg={"gainsboro"}
      >
        {user && <Contacts fetchAgain={fetchAgain} />}
        {user && (
          <ChatContainer
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
      </Box>
    </Box>
  );
};

export default Chat;
