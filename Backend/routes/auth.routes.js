import express from 'express';
import { Login, logout, signUp } from '../controllers/auth.controllers.js';

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", Login)
authRouter.get("/logout", logout)
export default authRouter