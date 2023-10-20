import axios from "axios";

export default class Api {
  constructor() {
    // this.base_url = process.env.REACT_APP_BASE_URL;
    this.base_url = "http://localhost:5000";
  }

  registerRoute(username, email, password) {
    return axios.post(`${this.base_url}/api/auth/register`, {
      username,
      email,
      password,
    });
  }

  loginRoute(username, password) {
    return axios.post(`${this.base_url}/api/auth/login`, {
      username,
      password,
    });
  }

  getUserData(id) {
    return axios.get(`${this.base_url}/api/auth/getalluser/${id}`);
  }

  sendMessageRoute(from, to, message) {
    return axios.post(`${this.base_url}/api/messages/addmsg`, {
      from,
      to,
      message,
    });
  }

  recieveMessageRoute(from, to) {
    return axios.post(`${this.base_url}/api/messages/getmsg`, {
      from,
      to,
    });
  }

  logoutRoute() {
    return axios.post(`${this.base_url}/api/auth/logout`, {});
  }

  setAvatarRoute(id, image) {
    return axios.post(`${this.base_url}/api/auth/setavatar/${id}`, {
      image,
    });
  }

  getRandomAvatar() {
    return axios.get(
      `https://api.multiavatar.com/${Math.round(Math.random() * 1000)}`
    );
  }
}
