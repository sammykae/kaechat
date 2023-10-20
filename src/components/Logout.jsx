import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import Api from "../utils/Api";
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = JSON.parse(sessionStorage.getItem("chat-app-user"))._id;
    const API = new Api();
    API.logoutRoute(id)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.removeItem("chat-app-user");
          navigate("/");
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
