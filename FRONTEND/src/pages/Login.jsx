import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {login} = useAuth()

    const navigate = useNavigate()

    const handleSubmit =async (e) =>{
        e.preventDefault()

        try {
        const res = await axios.post('http://localhost:3000/api/user/login',
            {email , password},
            {
            withCredentials : true,
            headers : {
                "Content-Type" :"application/json"
                }
            })

            login(res.data.user)
            console.log("LOGIN RES:", res.data);
            toast.success(res.data.message || "Login successfull")
            navigate('/')
        } catch (error) {
        toast.error(error.response?.data?.message || 'Error')
        console.log("error",error)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-500 text-center">Login</h1>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className='text-sm font-medium'>Email</label>
                        <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        placeholder="Enter your Email"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    </div>
                    <div>
                        <label htmlFor="name" className='text-sm font-medium'>Paaword</label>
                        <input
                        type="password"
                        id="pasword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="*************"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        <Link className='text-shadow-md px-4 font-semibold cursor-pointer' to='/reset-password'>forgot your password ? Forgat</Link>
                    </div>
                    <hr />
                    <button type='submit'
                    className='w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg transition duration-200 mt-4'>
                        Login
                    </button>
                </form>
                    <p className='text-xs flex items-center justify-center'>If your have not registered?<Link to='/register'>register</Link></p>
            </div>
        </div>
    )
}

export default Login
