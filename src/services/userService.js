import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const getFollowingUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_URL}/user/following`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
