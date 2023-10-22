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
import { useNavigate } from "react-router-dom";
import Api from "../../utils/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const API = new Api();
    API.login(email, password)
      .then((res) => {
        toast({
          title: "Login Successful",
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
              type={show ? "text" : "password"}
              value={password}
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

        <Button
          colorScheme="orange"
          w={"50%"}
          margin={"auto"}
          mt={5}
          type="submit"
          isLoading={loading}
        >
          login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
