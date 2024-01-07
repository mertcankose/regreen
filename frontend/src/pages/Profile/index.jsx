import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { API_URL } from "../../constants/url";
import { successMessage, errorMessage } from "../../helpers/toast";
import axios from "axios";
import imageCompression from "browser-image-compression";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const Profile = () => {
  const { auth } = useContext(AuthContext);

  const [username, setUsername] = useState(auth.username);
  const [email, setEmail] = useState(auth.email);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [emailUpdateModalIsOpen, setEmailUpdateModalIsOpen] = useState(false);
  const [passwordForEmailUpdate, setPasswordForEmailUpdate] = useState("");

  const [updateLoadingImage, setUpdateLoadingImage] = useState(false);

  const openEmailUpdateModal = () => {
    setEmailUpdateModalIsOpen(true);
  };

  const closeEmailUpdateModal = () => {
    setEmailUpdateModalIsOpen(false);
  };

  const handleEmailUpdate = async () => {
    console.log("Updating email with password:", passwordForEmailUpdate);
    updateEmail();
    closeEmailUpdateModal();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setProfileImagePreview(imageUrl);
  };

  const updateProfileImage = async () => {
    setUpdateLoadingImage(true);
    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1920,
        useWebWorker: false,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      let formData = new FormData();
      formData.append("avatar", compressedFile);

      const response = await axios.post(`${API_URL}/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("photo response: ", response);

      if (response.status === 200) {
        successMessage("Avatar changed successfully");
      } else {
        errorMessage("Error updating profile image");
      }
    } catch (error) {
      errorMessage("Error updating profile image");
    } finally {
      setUpdateLoadingImage(false);
    }
  };

  const updateUsername = async () => {
    try {
      const response = await axios.post(`${API_URL}/me`, { username }, { headers: { Authorization: `Bearer ${auth.token}` } });

      if (response.status === 200) {
        successMessage("Successfully updated username");
      } else {
        errorMessage("Error updating username");
      }
    } catch (error) {
      errorMessage("Error updating username");
    }
  };

  const updateEmail = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/change-email`,
        { email, password: passwordForEmailUpdate },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      successMessage("Successfully updated email");
    } catch (error) {
      errorMessage("Error updating email");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Modal
        isOpen={emailUpdateModalIsOpen}
        onRequestClose={closeEmailUpdateModal}
        style={customStyles}
        contentLabel="Update Email"
      >
        <button onClick={closeEmailUpdateModal} className="ml-auto w-full text-right">
          X
        </button>
        <div>
          <label htmlFor="passwordForEmailUpdate" className="text-sm font-bold">
            Please enter your password:
          </label>
          <input
            type="password"
            id="passwordForEmailUpdate"
            value={passwordForEmailUpdate}
            onChange={(e) => setPasswordForEmailUpdate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleEmailUpdate} className="mt-2 px-4 py-2 bg-primary text-white rounded">
            Confirm
          </button>
        </div>
      </Modal>
      <h4 className="mb-6 font-bold text-3xl">Profile</h4>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">Username</label>
        <input type="text" className="w-full p-2 border rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={updateUsername} className="mt-2 px-4 py-2 bg-primary text-white rounded">
          Update Username
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
        <input type="email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={openEmailUpdateModal} className="mt-2 px-4 py-2 bg-primary text-white rounded">
          Update Email
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">Profile Image</label>
        <input type="file" className="w-full p-2 border rounded" onChange={handleImageChange} />
        {profileImagePreview && (
          <img src={profileImagePreview} alt="Profile Preview" className="mt-4 w-20 h-20 object-cover rounded-full" />
        )}
        <button onClick={updateProfileImage} className="mt-2 px-4 py-2 bg-primary text-white rounded">
          Update Profile Image
        </button>
        {updateLoadingImage && <p>Updating profile image...</p>}
      </div>
    </div>
  );
};

export default Profile;
