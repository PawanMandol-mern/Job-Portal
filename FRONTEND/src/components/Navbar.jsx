    import React, { useState } from 'react'
    import { Link } from 'react-router-dom'
    import { useAuth } from '../context/AuthContext'

    const Navbar = () => {
    const { isAuthenticate, user, logout, loading } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    if (loading) {
        return <p className='text-center mt-5'>Loading...</p>
    }

    return (
        <nav className='bg-white shadow-md sticky top-0 z-50'>
        
        {/* TOP BAR */}
        <div className='flex justify-between items-center px-6 py-4'>
            
            {/* LOGO */}
            <h1 className='text-2xl font-bold text-blue-600'>JobPortal</h1>

            {/* DESKTOP MENU */}
            <div className='hidden md:flex items-center gap-6'>
            <Link to='/' className='hover:underline'>Home</Link>
            <Link to='/jobs' className='hover:underline'>Jobs</Link>

            {!isAuthenticate && (
                <>
                <Link to='/login' className='px-4 py-2 bg-orange-500 text-white rounded-md'>Login</Link>
                <Link to='/register' className='px-4 py-2 bg-orange-500 text-white rounded-md'>Register</Link>
                </>
            )}

            {/* USER */}
            {isAuthenticate && user?.role?.toLowerCase() === 'user' && (
                <>
                <Link to='/my-application'>My Application</Link>
                <span className='bg-gray-400 text-white px-3 py-1 rounded'>
                    {user?.fullName}
                </span>
                <button onClick={logout} className='bg-orange-500 text-white px-4 py-2 rounded'>
                    Logout
                </button>
                </>
            )}

            {/* RECRUITER */}
            {isAuthenticate && user?.role?.toLowerCase() === 'recruiter' && (
                <>
                <Link to='/create-job'>Create Job</Link>
                <Link to='/dashboard'>Dashboard</Link>
                <span className='bg-gray-400 text-white px-3 py-1 rounded'>
                    {user?.fullName}
                </span>
                <button onClick={logout} className='bg-orange-500 text-white px-4 py-2 rounded'>
                    Logout
                </button>
                </>
            )}
            </div>

            {/* MOBILE BUTTON */}
            <button
            className='md:hidden text-2xl'
            onClick={() => setMenuOpen(!menuOpen)}
            >
            ☰
            </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
            <div className='md:hidden flex flex-col gap-4 px-6 pb-4 border-t'>

            <Link to='/' onClick={()=>setMenuOpen(false)}>Home</Link>
            <Link to='/jobs' onClick={()=>setMenuOpen(false)}>Jobs</Link>

            {!isAuthenticate && (
                <>
                <Link to='/login' onClick={()=>setMenuOpen(false)}>Login</Link>
                <Link to='/register' onClick={()=>setMenuOpen(false)}>Register</Link>
                </>
            )}

            {/* USER */}
            {isAuthenticate && user?.role?.toLowerCase() === 'user' && (
                <>
                <Link to='/my-application' onClick={()=>setMenuOpen(false)}>
                    My Application
                </Link>
                <span className='bg-gray-400 text-white px-3 py-1 rounded'>
                    {user?.fullName}
                </span>
                <button onClick={logout} className='bg-orange-500 text-white px-4 py-2 rounded'>
                    Logout
                </button>
                </>
            )}

            {/* RECRUITER */}
            {isAuthenticate && user?.role?.toLowerCase() === 'recruiter' && (
                <>
                <Link to='/create-job' onClick={()=>setMenuOpen(false)}>
                    Create Job
                </Link>
                <Link to='/dashboard' onClick={()=>setMenuOpen(false)}>
                    Dashboard
                </Link>
                <span className='bg-gray-400 text-white px-3 py-1 rounded'>
                    {user?.fullName}
                </span>
                <button onClick={logout} className='bg-orange-500 text-white px-4 py-2 rounded'>
                    Logout
                </button>
                </>
            )}
            </div>
        )}
        </nav>
    )
    }

    export default Navbar