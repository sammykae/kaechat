import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../utils/Api";
export default function SetAvatar() {
  const api = `https://api.multiavatar.com`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    if (!sessionStorage.getItem("chat-app-user")) {
      navigate("/");
    } else {
      const user = JSON.parse(sessionStorage.getItem("chat-app-user"));
      if (user.isAvatarImageSet) {
        navigate("/chat");
      }
    }
  }, [navigate]);

  const setProfilePicture = () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar");
    } else {
      const user = JSON.parse(sessionStorage.getItem("chat-app-user"));
      const API = new Api();
      API.setAvatarRoute(user._id, avatars[selectedAvatar]).then((res) => {
        if (res?.data?.isSet) {
          user.isAvatarSet = true;
          user.avatarImage = res?.data?.image;
          sessionStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.");
        }
      });
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = [];
      const API = new Api();
      for (let i = 0; i < 4; i++) {
        await API.getRandomAvatar()
          .then((res) => {
            const buffer = new Buffer(res.data);
            data.push(buffer.toString("base64"));
          })
          .catch((err) => console.log(err));
      }
      setAvatars(data);
      setIsLoading(false);
    };

    getData();
  }, [api]);
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars?.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
