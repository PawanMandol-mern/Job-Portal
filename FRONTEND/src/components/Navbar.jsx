import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const {isAuthenticate,user,logout,loading} = useAuth()

    // const navigate = useNavigate()

    if(loading){
        return <p className='text-center mt-5'>Loading...</p>
    }
    return (
    <nav className='flex justify-between items-center sticky top-0 z-50 shadow-md px-6 py-4  bg-white'>
        {/* left */}
        <div className='flex items-center gap-20'>
            <h1 className='text-2xl font-bold text-blue-600 '>JobPortal</h1>
            <div className='space-x-8'>
                <Link to='/' className='hover:underline text-xl'>Home</Link>
                <Link to='/jobs'className='hover:underline text-xl'>jobs</Link>
            </div>
        </div>
        {/* right */}
        <div className='flex items-center gap-4'>   
            {
                !isAuthenticate && (
                    <>
                    <Link to='/login' className='px-8 py-2 bg-orange-500 rounded-md text-white font-semibold hover:bg-orange-400'>Login</Link>
                    <Link to='/register' className='px-8 py-2 bg-orange-500 rounded-md text-white font-semibold hover:bg-orange-400'>Register</Link>
                    </>
                )}
                {/* users */}
            {
                isAuthenticate && user?.role?.toLowerCase() === 'user' && (
                    <>
                    <Link to='/my-application' className='hover:underline text-xl'>My Application</Link>
                    <span className='text-sm font-semibold bg-gray-400 rounded-md px-4 py-2 text-white'>{user?.fullName}</span>
                    <Link 
                    onClick={logout}
                    className='px-8 py-2 bg-orange-500 rounded-md text-white font-semibold hover:bg-orange-400'>Logout</Link>
                    </>
                )
            }

            {/* Recruiter */}
            {
                isAuthenticate && user?.role?.toLowerCase() === 'recruiter' && (
                    <>
                    <Link to='/create-job' className='hover:underline text-xl'>Create Job</Link>
                    <Link to='/dashboard' className='hover:underline text-xl'>Dashboard</Link>
                    <Link className='text-sm font-semibold bg-gray-400 rounded-md px-4 py-2 text-white'>{user?.fullName}</Link>
                    <Link 
                    onClick={logout}
                    className='px-8 py-2 bg-orange-500 rounded-md text-white font-semibold hover:bg-orange-400'>Logout</Link>
                    </>
                )
            }
        </div>
    </nav>
    )
}

export default Navbar
