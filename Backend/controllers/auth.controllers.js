import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const exitEmail = await User.findOne({ email })

        if (exitEmail) {
            return res.status(400).json({ message: "email already exists ..!" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters.. !" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, password: hashedPassword, email
        })

        // generate token
        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(201).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `sign up error ${error}` })
    }
}

// For login 

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "email does not exists ..!" })
        }

        const isCheck = await bcrypt.compare(password, user.password)
        if (!isCheck) {
            return res.status(400).json({ message: "incorrect password ..!" })
        }



        // generate token
        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json(user)

    }
    catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}