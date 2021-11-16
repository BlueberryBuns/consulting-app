import axios from "axios";

const authAxios = axios.create({
  baseURL: "https://192.168.50.39:8000",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export default authAxios;
