import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { errorMessage, successMessage } from "../../helpers/toast";
import { API_URL } from "../../constants/url";

const FeedHeader = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const logout = async () => {
    console.log("t: ", auth.token);
    try {
      const response = await axios.post(`${API_URL}/logoutAll`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      navigate("/login");
      console.log("success");

      successMessage("All sessions have been successfully terminated.");
      localStorage.removeItem("token");
      setAuth({
        username: "",
        email: "",
        profileImage: null,
        token: null,
        id: null,
      });

      console.log("scc");
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <div className="container mx-auto px-4 flex justify-between items-center my-4">
      <Link to="/feed" className="text-2xl font-bold">
        Feed
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="">
          Profile
        </Link>
        <button
          onClick={() => {
            logout();
          }}
          className=""
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default FeedHeader;
