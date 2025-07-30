import React, { useContext } from 'react';
import './Card.css';
import { userDataContext } from '../context/userContext';

const Card = ({ image }) => {
  const {serverUrl,
      userData,
      setUserData,
      backendImage, setBackendImage,
      frontedImage, setFrontendImage,
      selectedImage, setSelectedImage} = useContext(userDataContext)

  return (
    <div className={`card-container ${selectedImage === image ? "selected-card" : ""}`} 
    onClick={() => {
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
      }}
      >
      <img src={image} className='card-image' alt="" />
    </div>
  );
};

export default Card;
