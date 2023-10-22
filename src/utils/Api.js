import axios from "axios";

export default class Api {
  constructor() {
    this.base_url = process.env.REACT_APP_BASE_URL;

    this.token = JSON.parse(localStorage?.getItem("user"))?.token;
  }

  register(username, email, password, avatar) {
    return axios.post(`${this.base_url}/api/auth/register`, {
      username,
      email,
      password,
      avatar,
    });
  }

  login(email, password) {
    return axios.post(`${this.base_url}/api/auth/login`, {
      email,
      password,
    });
  }

  searchChat(text) {
    return axios.get(
      `${this.base_url}/api/auth/getusers?search=${text}`,

      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  accessChat(userId) {
    return axios.post(
      `${this.base_url}/api/chat`,
      {
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  getChats() {
    return axios.get(`${this.base_url}/api/chat`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  createGroupChat(name, users) {
    return axios.post(
      `${this.base_url}/api/chat/group`,
      {
        name,
        users,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  getAllChat(id) {
    return axios.get(`${this.base_url}/api/auth/getalluser/${id}`);
  }

  sendMessage(chatId, content) {
    return axios.post(
      `${this.base_url}/api/message`,
      {
        chatId,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  getAllMessages(chatId) {
    return axios.get(`${this.base_url}/api/message/${chatId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  renameGroupChat(chatName, chatId) {
    return axios.put(
      `${this.base_url}/api/chat/group`,
      {
        chatName,
        chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  addUserToGroup(userId, chatId) {
    return axios.put(
      `${this.base_url}/api/chat/add`,
      {
        userId,
        chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  removeUserFromGroup(userId, chatId) {
    return axios.put(
      `${this.base_url}/api/chat/remove`,
      {
        userId,
        chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }
}
