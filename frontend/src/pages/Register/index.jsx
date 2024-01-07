import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../helpers/toast";
import axios from "axios";
import { API_URL } from "../../constants/url";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSuccessOtp, setIsSuccessOtp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const { username, email, password, confirmPassword } = formData;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isUsernameValid = username.length >= 3;
    const isPasswordValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    const isPasswordsMatch = password === confirmPassword;

    setIsFormValid(isEmailValid && isUsernameValid && isPasswordValid && isPasswordsMatch);
  }, [formData]);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setShowError(true);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errorMessage("Invalid email format");
      }
      if (formData.username.length < 3) {
        errorMessage("Username must be at least 3 characters long");
      }
      if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(formData.password)) {
        errorMessage("Password must be at least 8 characters long and include at least one special character");
      }
      if (formData.password !== formData.confirmPassword) {
        errorMessage("Passwords do not match");
      }
      if (isSuccessOtp === false) {
        errorMessage("Please verify your email");
      }
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      if (response.status === 201) {
        successMessage("Successfully registered");
        navigate("/login");
      } else {
        errorMessage("Register failed");
      }
    } catch (error) {
      errorMessage("Register failed");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const sendVerificationCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/send-otp-code`, { email: formData.email });
      console.log("r: ", response);
      successMessage("Verification code sent successfully");
    } catch (error) {
      errorMessage("Verification code sending failed");
    }
  };

  const approveVerificationCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/validate-otp`, { email: formData.email, otp: formData.verificationCode });
      console.log("r: ", response);
      successMessage("Verification code sent successfully");
      setIsSuccessOtp(true);
    } catch (error) {
      errorMessage("Verification code sending failed");
    }
  };

  return (
    <div className="bg-primary flex justify-center items-center h-screen px-4 py-4">
      <div className="w-full max-w-[680px] bg-white px-12 py-8 rounded-md">
        <h2 className="font-bold text-center mb-9 text-4xl text-primary">Signup</h2>
        {/* Form inputs */}
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
        <div className="mb-4 flex gap-2 items-center">
          <div className="flex-grow">
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
          <button className="px-4 py-1.5 bg-primary text-white mt-6 rounded" onClick={sendVerificationCode}>
            Send Code
          </button>
        </div>
        <div className="mb-4 flex gap-2 items-center">
          <div className="flex-grow">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="verificationCode"
              type="text"
              name="verificationCode"
              placeholder="Verification Code"
              value={formData.verificationCode}
              onChange={handleChangeValue}
            />
          </div>
          <button className="px-4 py-1.5 bg-primary text-white mt-6 rounded" onClick={approveVerificationCode}>
            Approve Code
          </button>
        </div>
        {/* Password inputs */}
        {/* Password field */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
            Password
          </label>
          <div className="flex justify-between">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              value={formData.password}
              onChange={handleChangeValue}
            />
            <span className="ml-2 flex items-center text-sm leading-5 cursor-pointer" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? "Hide" : "Show"}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Your password must include at least one special character and be at least 8 characters long.
          </p>
        </div>

        {/* Confirm Password field */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="flex justify-between">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChangeValue}
            />
            <span className="ml-2 flex items-center text-sm leading-5 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
              {isConfirmPasswordVisible ? "Hide" : "Show"}
            </span>
          </div>
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
