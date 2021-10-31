import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export default authAxios;
