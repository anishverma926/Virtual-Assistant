import React, { useContext } from 'react';
import Card from '../components/Card';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import authBg from "../assets/authBg.png";
import ai from '../assets/ai.gif';
import { RiImageAddLine } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";

import './Customize.css'; // 👈 Import CSS file
import { useState } from 'react';
import { useRef } from 'react';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const Customize = () => {
    const { serverUrl,
        userData,
        setUserData,
        backendImage, setBackendImage,
        frontedImage, setFrontendImage,
        selectedImage, setSelectedImage } = useContext(userDataContext)

    const navigate = useNavigate()

    const inputImage = useRef()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    return (
        <div className='customize-container'>
            <MdKeyboardBackspace className='absolute top-[30px] left-[30px] 
                            text-white w-[25px] h-[25px] cursor-pointer '
                onClick={() => (navigate("/"))} />
            <h1 className='customize-title'>
                Select your <span className='text-blue-200'>Assistant Image</span>
            </h1>
            <div className='customize-card-wrapper'>
                <Card image={authBg} />
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />
                <Card image={ai} />
                <div className={`customize-add-card ${selectedImage === "input" ? "selected-custom-card" : ""}`}
                    onClick={() => {
                        inputImage.current.click()
                        setSelectedImage("input")
                    }}>
                    {!frontedImage && <RiImageAddLine className='customize-add-icon' />}
                    {frontedImage && <img src={frontedImage}
                        className='h-full object-cover rounded-2xl' />}

                </div>
                <input type='file' accept='image/*' ref={inputImage} hidden
                    onChange={handleImage} />
            </div>

            {/* if image is selected then next button will be shown */}

            {selectedImage && <button className="customize1-button"
                onClick={() => navigate("/customize2")}>Next</button>}
        </div>
    );
};

export default Customize;
