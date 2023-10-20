import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "styled-components";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import Api from "../utils/Api";
const Register = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("chat-app-user")) {
      navigate("/chat");
    }
  }, [navigate]);
  const handleValidation = () => {
    const { password, repassword, username } = details;
    if (password !== repassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.");
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters.");
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = details;
      const API = new Api();

      API.registerRoute(username, email, password)
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
    }
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
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          onChange={(e) => handleChange(e)}
        />

        <input
          type="password"
          name="password"
          required
          placeholder="Create a password"
          onChange={(e) => handleChange(e)}
        />

        <input
          type="password"
          name="repassword"
          required
          placeholder="Confirm Password"
          onChange={(e) => handleChange(e)}
        />

        <button>Create user</button>

        <span>
          Already have an account? <Link to={"/"}>Login</Link>
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

export default Register;
