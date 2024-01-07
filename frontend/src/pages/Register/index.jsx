import { Link, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import { useState, useEffect } from "react";
import { errorMessage, successMessage } from "../../helpers/toast";
import { API_URL } from "../../constants/url";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isFormFilled =
      formData.username &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password == formData.confirmPassword;

    setIsFormValid(isFormFilled);
  }, [formData]);

  const handleChangeValue = (e) => {
    const { name, value } = e.target; // Burada id yerine name kullanılıyor
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form Data:", formData);
      register();
    } else {
      setShowError(true);
      errorMessage("Please fill in all fields");
    }
  };

  const register = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      console.log("r: ", response);
      console.log(response.status);
      if (response.status === 201) {
        navigate("/login");
      } else {
        errorMessage("Register failed");
      }
    } catch (error) {
      errorMessage("Register failed");
    }
  };

  return (
    <div className="bg-primary flex justify-center items-center h-screen px-4 py-4">
      <div className="w-full max-w-[680px] bg-white px-12 py-8 rounded-md">
        <h2 className="font-bold text-center mb-9 text-4xl text-primary">Signup</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChangeValue}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChangeValue}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChangeValue}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="passwordConfirm">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="passwordConfirm"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
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
            onClick={handleSubmit}
          >
            Signup
          </button>
          {showError && <p className="text-red-500 text-xs italic mt-2">Please fill in all fields</p>}
          <Link to="/login" className="inline-block text-lightGray align-baseline mt-4 font-bold text-sm" href="/login">
            Already have an account? <span className="text-primary">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
