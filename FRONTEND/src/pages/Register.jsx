import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'

const Register = () => {
    const [fullName,setFullName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [otp,setOtp] = useState('')
    const [role , setRole] = useState('user')

    const [otpSent, setOtpSent] = useState(false)
    const [verified, setVerified] = useState(false)

    const navigate = useNavigate()

    // SEND OTP 
    const handleSendOtp = async () => {
        if(!email){
            return toast.error("Enter email first")
        }

        try {
            const res = await axios.post(
                'http://localhost:3000/api/user/send-otp',
                { email }
            )

            toast.success(res.data.message)
            setOtpSent(true)

        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending OTP")
        }
    }

    //  VERIFY OTP 
    const handleVerifyOtp = async () => {
        if(!otp){
            return toast.error("Enter OTP")
        }

        try {
            const res = await axios.post(
                'http://localhost:3000/api/user/verify-email',
                { email, otp }
            )

            toast.success(res.data.message)
            setVerified(true)

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP")
        }
    }

    //  REGISTER 
    const handleSubmit = async (e) =>{
        e.preventDefault()

        if(!verified){
            return toast.error("Please verify email first")
        }

        try {
            const res = await axios.post(
                'http://localhost:3000/api/user/register',
                {fullName,email,password,role},
                {
                    withCredentials : true,
                    headers :{
                        "Content-Type" :"application/json"
                    }
                }
            )

            toast.success(res.data.message || "Register successful")
            navigate('/login')

        } catch (error) {
            toast.error(error.response?.data?.message || "Error")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">

                <h1 className="text-2xl font-bold text-blue-500 text-center">
                    Register
                </h1>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

                    {/* FULL NAME */}
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border rounded"
                    />

                    {/* EMAIL + SEND OTP */}
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-3 py-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            className="bg-blue-500 text-white px-3 rounded"
                        >
                            OTP
                        </button>
                    </div>

                    {/* OTP + VERIFY */}
                    {otpSent && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="w-full px-3 py-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="bg-green-500 text-white px-3 rounded"
                            >
                                Verify
                            </button>
                        </div>
                    )}

                    {/* VERIFIED MESSAGE */}
                    {verified && (
                        <p className="text-green-600 text-sm">
                            ✅ Email Verified
                        </p>
                    )}

                    {/* PASSWORD */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded"
                    />

                    {/* ROLE */}
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`w-1/2 py-2 ${
                                role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            }`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("recruiter")}
                            className={`w-1/2 py-2 ${
                                role === "recruiter"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            }`}
                        >
                            Recruiter
                        </button>
                    </div>

                    {/* REGISTER */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded"
                    >
                        Register
                    </button>

                </form>

                <p className='text-xs text-center mt-3'>
                    Already have account? <Link to='/login'>Login</Link>
                </p>

            </div>
        </div>
    )
}

export default Register