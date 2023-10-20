import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "styled-components";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import Api from "../utils/Api";
const Login = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("chat-app-user")) {
      navigate("/chat");
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = details;
    const API = new Api();

    API.loginRoute(username, password)
      .then((res) => {
        if (res?.data?.status === true) {
          sessionStorage.setItem(
            // process.env.REACT_APP_LOCALHOST_KEY,
            "chat-app-user",
            JSON.stringify(res?.data?.user)
          );
          toast.success(res?.data?.msg);
          navigate("/chat");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
      });
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <img src={logo} alt="kaechats" />
          <h1>KAENOTE</h1>
        </div>

        <input
          type="text"
          name="username"
          required
          placeholder="Enter a username"
          onChange={(e) => handleChange(e)}
        />

        <input
          type="password"
          name="password"
          required
          placeholder="Enter your password"
          onChange={(e) => handleChange(e)}
        />

        <button>Login</button>

        <span>
          Don't have an account? <Link to={"/register"}>Register</Link>
        </span>
      </form>
    </FormContainer>
  );
};
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131330;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
