import React, { useContext, useState } from 'react'
import './Customize2.css';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


const Customize2 = () => {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    // ✅ Use correct key name: serverUrl (all lowercase)

    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "");
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        setLoading(true)
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);

            if (backendImage) {
                formData.append("assistantImage", backendImage); // send file
            }
            else {
                formData.append("imageUrl", selectedImage); // send URL string
            }

            const result = await axios.post(
                `${serverUrl}/api/user/update`,
                formData,
                { withCredentials: true }
            );

            setLoading(false)

            console.log(result.data);
            setUserData(result.data);

            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log("Update error:", error);
        }
    };


    return (
        <div className='customize-container'>
            <MdKeyboardBackspace className='absolute top-[30px] left-[30px] 
                text-white w-[25px] h-[25px] cursor-pointer '
                onClick={() => (navigate("/customize"))} />

            <h1 className='customize-title'>Enter Your
                <span className='text-blue-200'> Assistant Name</span>
            </h1>
            <input
                type="text"
                placeholder="eg: Jarvis"
                className="input"
                required
                onChange={(e) => setAssistantName(e.target.value)} value={assistantName}
            />

            {assistantName && <button className="customize2-button"
                disabled={loading}
                onClick={() => {
                    handleUpdateAssistant()
                }}>
                {!loading ? "Finally Create Your Assistant" : "Loading"}
            </button>
            }


        </div>
    )
}

export default Customize2
