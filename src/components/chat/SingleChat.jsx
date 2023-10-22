import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "../styles.css";
import {
  Button,
  IconButton,
  Spinner,
  useToast,
  InputGroup,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../utils/ChatLogics";
import { useEffect, useRef, useState } from "react";
import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
import ProfileModal from "../chat/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "../chat/UpdateGroupChatModal";
import { ChatState } from "../../Context/ChatProvider";
import Api from "../../utils/Api";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import em from "../../assets/emoji.png";
const ENDPOINT = process.env.REACT_APP_BASE_URL;
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const API = new Api();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    API.getAllMessages(selectedChat._id)
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      });
  };

  const sendMessage = async (event, button) => {
    if (event?.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      API.sendMessage(selectedChat, newMessage)
        .then((res) => {
          // emit message to server to send to other in chat
          socket.emit("new message", res.data);
          setMessages([...messages, res.data]);
          setNewMessage("");
        })
        .catch((err) => {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        });
      return;
    } else {
      if (button && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        API.sendMessage(selectedChat, newMessage)
          .then((res) => {
            // emit message to server to send to other in chat
            socket.emit("new message", res.data);
            setMessages([...messages, res.data]);
            setNewMessage("");
          })
          .catch((err) => {
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
          });
      }
      return;
    }
  };

  // Conect to server's socket instance
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  /*  Emit event when user open a chat  */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      const API = new Api();
      setLoading(true);
      API.getAllMessages(selectedChat._id)
        .then((res) => {
          setMessages(res.data);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        })
        .catch((err) => {
          setLoading(false);
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    };
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, toast]);

  /*    Handles sending of message to the active chat
  or notifcation if the message is not meant for the active chat */
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.find((n) => n._id === newMessage._id)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      // Sends the typing event to server
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        // Sends the stop typing event to server
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChat]);

  const onClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users).toUpperCase()}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box className="messages">
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <Box>
                  <Lottie
                    options={defaultOptions}
                    height={15}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </Box>
              ) : (
                <></>
              )}
              {showEmoji && (
                <Box>
                  <EmojiPicker
                    onEmojiClick={onClick}
                    autoFocusSearch={false}
                    width={300}
                    searchDisabled
                    emojiStyle={EmojiStyle.GOOGLE}
                    height={300}
                  />
                </Box>
              )}
              <InputGroup display={"flex"} columnGap={3} alignItems={"center"}>
                <Box
                  cursor={"pointer"}
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  <Image width={10} src={em} />
                </Box>
                <Input
                  autoComplete="off"
                  autoCapitalize={"yes"}
                  ref={inputRef}
                  variant="filled"
                  onFocus={() => setShowEmoji(false)}
                  bg="#E0E0E0"
                  p={{ base: "10px 60px 10px 10px", md: "10px 80px 10px 10px" }}
                  focusBorderColor="orange.600"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                />

                <InputRightElement width={{ base: "3.5rem", md: "4.5rem" }}>
                  <Button
                    colorScheme="orange"
                    variant={"solid"}
                    size={"md"}
                    w={"100%"}
                    onClick={(e) => sendMessage(e, true)}
                  >
                    <ArrowRightIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
