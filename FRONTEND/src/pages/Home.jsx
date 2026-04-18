import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Home = () => {
  const [jobs, setJobs] = useState([])

  const {isAuthenticate , user} = useAuth()
  const navigate = useNavigate()

  const handleOnChange = () => {
    if (!isAuthenticate) {
      toast.error("Please login as recruiter ❗")
      navigate('/login')
    } 
    else if (user.role !== 'recruiter') {
      toast.error("Only recruiters can post jobs ❌")
    } 
    else {
      navigate('/create-job')
    }
}

  const fetchJob = async () =>{
    try {
        const res = await axios.get('http://localhost:3000/api/job/get-all-job?limit=3',
          {
            withCredentials : true
          })
          setJobs(res.data.jobs)
          console.log('fetchjob',res.data.jobs)
  } catch (error) {
    console.log('Error',error)
    }
  }

  useEffect(() =>{
    const initial = async () =>{
      await fetchJob()
    }
    initial()
  },[])
  return (
    <div>

      {/*  HERO */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          Find Your Dream Job 🚀
        </h1>
        <p className="mt-4 text-gray-600">
          Explore thousands of job opportunities with top companies
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link to='/jobs'
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Jobs
          </Link>

          <button
            onClick={handleOnChange}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Post a Job
          </button>
        </div>
      </section>

      {/* 🔍 SEARCH */}
      <section className="py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold">Search Jobs</h2>

        <div className="mt-4 flex justify-center gap-3">
          <input
            type="text"
            placeholder="Job title..."
            className="px-4 py-2 border rounded-lg w-64"
          />
          <input
            type="text"
            placeholder="Location..."
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Search
          </button>
        </div>
      </section>

      {/* 💼 FEATURED JOBS */}
      <section className="py-10 px-6">
  <h2 className="text-2xl font-semibold text-center">Featured Jobs</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
    
    {jobs.map((job) => (
      <div 
        key={job._id} 
        className="p-4 border rounded-lg shadow-sm flex flex-col justify-between"
      >

        {/* ✅ IMAGE FIX SIZE */}
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={job.companyLogo?.url || "https://via.placeholder.com/50"} 
            alt="logo"
            className="w-12 h-12 object-cover rounded-md border"
          />
          <h3 className="text-lg font-bold">{job.title}</h3>
        </div>

        {/*  DESCRIPTION FIX HEIGHT */}
        <p className="text-sm text-gray-600 min-h-10">
          {job.description?.slice(0, 60)}...
        </p>

        {/*  EXPERIENCE */}
        <p className="text-xs text-gray-500 mt-1">
          {job.experienceLevel}
        </p>

        {/*  SKILLS FIX */}
        <div className="flex flex-wrap gap-1 mt-2 min-h-7.5">
          {job.skillsRequired.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs bg-blue-100 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        {/*  JOB TYPE + LOCATION */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-green-600">{job.jobType}</p>
          <p className="text-xs text-gray-500">{job.location}</p>
        </div>

        {/*  BUTTON FIX POSITION */}
        <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Apply Now
        </button>

      </div>
    ))}

  </div>
</section>

      {/* ⭐ WHY US */}
      <section className="bg-gray-100 py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold">Why Choose Us?</h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold">Easy Apply</h3>
            <p className="text-sm text-gray-600">Apply in one click</p>
          </div>

          <div>
            <h3 className="font-bold">Top Companies</h3>
            <p className="text-sm text-gray-600">Verified recruiters</p>
          </div>

          <div>
            <h3 className="font-bold">Fast Hiring</h3>
            <p className="text-sm text-gray-600">Quick responses</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;