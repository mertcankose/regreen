import { createContext, useState, useEffect } from "react";
import { errorMessage, successMessage } from "../helpers/toast";
import axios from "axios";
import { API_URL } from "../constants/url";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    username: "",
    email: "",
    profileImage: null,
    token: null,
    _id: null,
  });

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      getProfile(token);
    }
  }, []);

  const getProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("r: ", response);
      if (response.status === 200) {
        console.log("User data:", response.data);
        setAuth({
          username: response.data.results.profile.username,
          email: response.data.results.profile.email,
          profileImage: response.data.results.profile.avatar,
          token: token,
          _id: response.data.results.profile._id,
        });
      } else {
        console.error("Failed to fetch user data");
        errorMessage("Failed to fetch user data");
      }
    } catch (error) {
      console.log("errrrr:", error);
      // errorMessage("An error occurred while fetching user data");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
