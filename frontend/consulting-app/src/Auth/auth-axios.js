import axios from "axios";

let url = `${window.location.protocol}//${window.location.host}`;
if (url === "http://localhost:3001") {
  console.log(url);
  url = "http://localhost:8000";
}

const authAxios = axios.create({
  baseURL: url,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export default authAxios;
