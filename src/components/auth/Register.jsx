import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import Api from "../../utils/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const instance = axios.create();
  const navigate = useNavigate();

  const postAvatar = async (file) => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (file !== null) {
      if (
        file?.type === "image/jpeg" ||
        file?.type === "image/png" ||
        file?.type === "image/jpg"
      ) {
        toast({
          title: "Uploading",
          position: "top",
          description: "Profile picture is uploading, please wait",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "kaemedia");
        await instance
          .post("https://api.cloudinary.com/v1_1/kaemedia/image/upload/", data)
          .then((res) => {
            setAvatar(res.data?.secure_url);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      } else {
        toast({
          title: "Unsupported",
          position: "top",
          description: "File type not supported",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    } else {
      toast({
        title: "Image Missing",
        position: "top",
        description: "Please select an image to upload",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== repassword) {
      toast({
        title: "Password Mismatch",
        position: "top",
        description: "Please confirm your password",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    const API = new Api();
    API.register(username, email, password, avatar)
      .then((res) => {
        toast({
          title: "Registration Successful",
          position: "top",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        setLoading(false);
        navigate("/chats");
      })
      .catch((err) => {
        toast({
          title: "An Error occured",
          position: "top",
          status: "error",
          description: err.response.data.message,
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      });
  };
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <Input
            focusBorderColor="orange.600"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            focusBorderColor="orange.600"
            placeholder="Email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <InputGroup>
            <Input
              focusBorderColor="orange.600"
              placeholder="Password"
              required
              value={password}
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                variant={"ghost"}
                size="md"
                onClick={() => setShow(!show)}
              >
                {!show ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <InputGroup>
            <Input
              focusBorderColor="orange.600"
              placeholder="Confirm Password"
              required
              value={repassword}
              type={show ? "text" : "password"}
              onChange={(e) => setRepassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                variant={"ghost"}
                size="md"
                onClick={() => setShow(!show)}
              >
                {!show ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <Input
            placeholder="Upload profile picture"
            type={"file"}
            accept="image/*"
            onChange={(e) => postAvatar(e.target.files[0])}
          />
        </FormControl>
        <Button
          colorScheme="orange"
          w={"50%"}
          margin={"auto"}
          mt={5}
          type="submit"
          isLoading={loading}
        >
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;
