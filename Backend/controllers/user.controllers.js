import { response } from "express";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import fs from 'fs';
import moment from "moment";
import { userInfo } from "os";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId from req:", userId);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("user found:", user);
    return res.status(200).json(user);
  }
  catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.status(500).json({ message: "Server error while getting user" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      // ✅ Upload to Cloudinary
      assistantImage = await uploadOnCloudinary(req.file.path);

      // ✅ Delete the file after upload
      fs.unlinkSync(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateAssistant:", error);
    return res.status(400).json({ message: "Update Assistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body

    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save();
    
    const userName = user.name
    const assistantName = user.assistantName
    const result = await geminiResponse(command, assistantName, userName)

    const jsonMatch = result.match(/{[\s\S]*}/)
    if (!jsonMatch) {
      return res.status(400).json({ response: "I can't understand" })
    }

    const gemResult = JSON.parse(jsonMatch[0])

    const type = gemResult.type

    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format('YYYY-MM-DD')}`
        });
      case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format('hh:mm A')}`
        });
      case 'get-day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format('dddd')}`
        });
      case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format('MMMM')}`
        });

      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'weather-show':

        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        })

      default:
        return res.status(400).json({ response: "I did't understand that command." })
    }

  } catch (error) {
    return res.status(500).json({ response: "ask assistand error." })
  }
}