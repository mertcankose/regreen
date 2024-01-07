import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { API_URL } from "../../constants/url";
import { successMessage, errorMessage } from "../../helpers/toast";
import axios from "axios";
import imageCompression from "browser-image-compression";

const Profile = () => {
  const { auth } = useContext(AuthContext);

  const [username, setUsername] = useState(auth.username);
  const [email, setEmail] = useState(auth.email);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setProfileImagePreview(imageUrl);
  };

  const updateProfileImage = async () => {
    try {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1920,
        useWebWorker: false,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      let formData = new FormData();
      formData.append("avatar", compressedFile);

      const response = await axios.post(`${API_URL}/avatar/${auth.id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        successMessage("Avatar changed successfully");
      } else {
        errorMessage("Error updating profile image");
      }
    } catch (error) {
      errorMessage("Error updating profile image");
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
      const response = await axios.post(`${API_URL}/me`, { email }, { headers: { Authorization: `Bearer ${auth.token}` } });

      if (response.status === 200) {
        successMessage("Successfully updated email");
      } else {
        errorMessage("Error updating email");
      }
    } catch (error) {
      errorMessage("Error updating email");
    }
  };

  return (
    <div className="container mx-auto p-4">
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
        <button onClick={updateEmail} className="mt-2 px-4 py-2 bg-primary text-white rounded">
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
      </div>
    </div>
  );
};

export default Profile;
