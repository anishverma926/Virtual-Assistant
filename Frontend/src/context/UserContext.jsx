import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {
  // const serverUrl = "https://virtual-assistant-backend-pgqz.onrender.com";
    const serverUrl = "https://virtual-assistant-backend-h84o.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontedImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current User:", result.data);
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
  };

  const getGeminiResponse = async (command)=>{
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, {command}, {withCredentials:true})
      return result.data

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage, setBackendImage,
    frontedImage, setFrontendImage,
    selectedImage, setSelectedImage,
    getGeminiResponse
    // handleCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
