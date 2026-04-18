import express from "express"
import {  getMe, login, logout, register, resetPassword, sendOtp, sendResetOtp, verifyEmail, verifyResetOtp } from "../Controllers/UserController.js"
import { AuthMid } from "../middleware/AuhtMid.js"


const userRoutes = express.Router()

userRoutes.post('/send-otp',sendOtp)
userRoutes.post('/verify-email',verifyEmail)
userRoutes.post('/register', register)

userRoutes.post('/login', login)
userRoutes.post('/reset-send-otp', sendResetOtp)
userRoutes.post('/verify-reset-otp', verifyResetOtp)
userRoutes.post('/reset-password', resetPassword)

userRoutes.get('/logout', logout)  
userRoutes.get('/me', AuthMid, getMe) 

export default userRoutes