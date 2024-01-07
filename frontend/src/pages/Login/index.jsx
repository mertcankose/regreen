import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { errorMessage, successMessage } from "../../helpers/toast";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../constants/url";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const { auth, setAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const isFormFilled = loginData.email && loginData.password;
    setIsFormValid(isFormFilled);
  }, [loginData]);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      login();
    } else {
      setShowError(true);
      errorMessage("Please fill in all fields");
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: loginData.email,
        password: loginData.password,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.results.token);
        setAuth({
          username: response.data.results.user.username,
          email: response.data.results.user.email,
          profileImage: response.data.results.user.avatar,
          token: response.data.results.token,
          id: response.data.results.user._id,
        });

        navigate("/feed");
      } else {
        errorMessage("Login failed");
      }
    } catch (error) {
      errorMessage("Login failed");
    }
  };

  return (
    <div className="bg-primary flex justify-center items-center h-screen px-4 py-4">
      <div className="w-full max-w-[680px] bg-white px-12 py-8 rounded-md">
        <h2 className="font-bold text-center mb-9 text-4xl text-primary">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleChangeValue}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="inline-block text-primary align-baseline font-bold text-sm" href="/forgot">
                Forgot Password
              </Link>
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChangeValue}
            />
          </div>

          <div className="flex flex-col items-center mx-auto justify-between px-8">
            <button
              className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none ${
                isFormValid ? "bg-primary" : "bg-gray-400 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!isFormValid}
            >
              Login
            </button>
            {showError && <p className="text-red-500 text-xs italic mt-2">Please fill in all fields</p>}

            <Link to="/register" className="inline-block text-lightGray align-baseline mt-4 font-bold text-sm" href="/register">
              Don't have an account? <span className="text-primary">Register</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
