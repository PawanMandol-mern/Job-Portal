import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { Toaster } from "react-hot-toast"
import Navbar from './components/Navbar'
import Jobs from './pages/Jobs'
import CreateJob from './components/Recruiter/CreateJob'
import ApplyJob from './components/User/ApplyJob'
import MyApplications from './components/User/MyApplications'
import Dashboard from './components/Recruiter/Dashboard'
import Updatejob from './components/Recruiter/Updatejob'
import ForgotPassword from './pages/ForgatePassword'

const App = () => {
  return (
    <div>
      <Toaster />
      <Navbar />
      
      <Routes>
        {/* <Route path='*' element={<h1>404 Page</h1>} /> */}

        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ForgotPassword />} />

        {/* Recruiter */}
        <Route path='/jobs' element={<Jobs/>}/>      
        <Route path='/create-job' element={<CreateJob/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/update-job/:id' element={<Updatejob/>}/>



      {/* user */}
        <Route path='/apply-job/:id' element={<ApplyJob/>}/>
        <Route path='/my-application' element={<MyApplications/>}/>
      </Routes>
    </div>
  )
}

export default App