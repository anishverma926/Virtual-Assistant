import React, { useRef, useState, useEffect, useContext } from 'react';
import './Home.css';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { RxCross1 } from "react-icons/rx";
import { CgMenuRight } from "react-icons/cg";



const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false);
  const [ham, setHam] = useState(false)
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const isRecognizingRef = useRef(false);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        // setListening(true);
      } catch (error) {
        if (!error.name !== "InvalidStateError") {
          console.error("start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';

    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    if (!data || !data.type || !data.response) {
      speak("Sorry, I couldn't process that.");
      return;
    }

    const { type, userInput, response } = data;
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'calculator-open') {
      window.open('https://www.google.com/search?q=calculator', '_blank');
    }

    if (type === 'instagram-open') {
      window.open('https://www.instagram.com/', '_blank');
    }

    if (type === 'facebook-open') {
      window.open('https://www.facebook.com/', '_blank');
    }

    if (type === 'weather-show') {
      window.open('https://www.google.com/search?q=weather', '_blank');
    }

    if (type === 'youtube-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    if (type === 'youtube-play') {
      fetchYouTubeVideoId(userInput).then(videoId => {
        if (videoId) {
          window.open(`https://www.youtube.com/watch?v=${videoId}&autoplay=1`, '_blank');
        } else {
          speak("Sorry, I couldn't find the video.");
        }
      });
    }


  };

  const fetchYouTubeVideoId = async (query) => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY; // 🔁 replace with your key
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const videoId = data.items?.[0]?.id?.videoId;
      return videoId;
    } catch (error) {
      console.error("YouTube fetch error:", error);
      return null;
    }
  };


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.log("Start error:", err);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted && !isSpeakingRef.current) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStareError")
                console.log(e);
            }
          }
        }, 3000);
      }
    };

    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStareError")
                console.log(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        console.log("Gemini response:", data);

        handleCommand(data); // This now safely handles null/undefined
        setAiText(data.response)
        setUserText("")
      }
    };

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you?`);
    greeting.lang = 'hi-IN';
    // greeting.onend = () => {
    //   startTimeout(); // start listening after speech
    // };
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout)
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className='home-container'>
      <CgMenuRight className='lg:hidden text-white 
      absolute top-[20px] right-[20px] w-[25px] h-[25px]'
        onClick={() => setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053]
      backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start 
      ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-white 
            absolute top-[20px] right-[20px] w-[25px] h-[25px]'
          onClick={() => setHam(false)} />
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer 
          text-[19px] px-[20px] py-[10px]' onClick={handleLogOut}>
          Log Out
        </button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer 
          text-[19px] px-[20px] py-[10px]' onClick={() => navigate("/customize")}>
          Customize your Assistant
        </button>

        <div className='w-full h-[2px] bg-gray-400 '></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] overflow-y-auto flex flex-col
        gap-[20px] truncate'>
          {userData.history?.map((his) => (
            <span className='text-gray-200 text-[18px] '>{his}</span>
          ))}
        </div>
      </div>
      <button className="logout-button" onClick={handleLogOut}>
        Log out
      </button>
      <button className="home-customize-button" onClick={() => navigate("/customize")}>
        Customize Your Assistant
      </button>
      <div className='home-image-wrapper'>
        <img src={userData?.assistantImage} alt="" className='home-image' />
      </div>
      <h1 className='home-title'>I'm {userData.assistantName}</h1>
      {!aiText && <img src={userImg}
        alt='' className='w-[200px]' />}
      {aiText && <img src={aiImg}
        alt='' className='w-[200px]' />}

      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText ? userText : aiText ? aiText : null}</h1>
    </div>
  );
};

export default Home;
