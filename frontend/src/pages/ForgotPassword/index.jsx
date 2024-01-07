import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../helpers/toast";
import axios from "axios";
import { API_URL } from "../../constants/url";

const ForgotPassword = () => {
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isFormFilled = forgotPasswordData.email && forgotPasswordData.verificationCode && forgotPasswordData.newPassword;
    const isPasswordValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(forgotPasswordData.newPassword);
    setIsFormValid(isFormFilled && isPasswordValid);
  }, [forgotPasswordData]);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({ ...forgotPasswordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      resetPassword();
    } else {
      setShowError(true);
      errorMessage("Please fill in all fields");
    }
  };

  const resetPassword = async () => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.verificationCode,
        newPassword: forgotPasswordData.newPassword,
      });

      successMessage("Password reset successfully");
      navigate("/login");
    } catch (error) {
      errorMessage("Password reset failed");
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email: forgotPasswordData.email });

      successMessage("Code sent successfully");
    } catch (error) {
      errorMessage("Password reset failed");
    }
  };

  return (
    <div className="bg-primary flex justify-center items-center h-screen px-4 py-4">
      <div className="w-full max-w-[680px] bg-white px-12 py-8 rounded-md">
        <h2 className="font-bold text-center mb-9 text-4xl text-primary">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-2 items-center">
            <div className="flex-grow">
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                name="email"
                placeholder="Email"
                value={forgotPasswordData.email}
                onChange={handleChangeValue}
              />
            </div>
            <button className="px-4 py-1.5 mt-5 bg-primary text-white rounded" type="button" onClick={sendVerificationCode}>
              Send Code
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="verificationCode"
              type="text"
              name="verificationCode"
              placeholder="Verification Code"
              value={forgotPasswordData.verificationCode}
              onChange={handleChangeValue}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={forgotPasswordData.newPassword}
              onChange={handleChangeValue}
            />
            <p className="text-xs text-gray-600 mt-1">
              Your password must include at least one special character and be at least 8 characters long.
            </p>
          </div>

          <div className="flex flex-col items-center mx-auto justify-between px-8">
            <button
              className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none ${
                isFormValid ? "bg-primary" : "bg-gray-400 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!isFormValid}
            >
              Reset Password
            </button>
            {showError && <p className="text-red-500 text-xs italic mt-2">Please fill in all fields</p>}
            <Link to="/login" className="inline-block text-lightGray align-baseline mt-4 font-bold text-sm" href="/login">
              Remembered your password? <span className="text-primary">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
