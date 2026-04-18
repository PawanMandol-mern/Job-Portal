/* eslint-disable react-hooks/exhaustive-deps */
    import axios from "axios";
    import React, { useEffect, useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

    const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search , setSearch] = useState('')
    const [location , setLocation] = useState('')
    const [jobType , setJobType] = useState('')

    const {isAuthenticate , user} = useAuth()
    const navigate = useNavigate()

    const handleApplyChange = (jobId) => {
        if (!isAuthenticate) {
            navigate('/login')
        } else {
            navigate(`/apply-job/${jobId}`)
        }
    }

    // pagination
    const [page, setPage] = useState(1);
    const limit = 6;

    const fetchJobs = async () => {
        try {
        setLoading(true);

        const res = await axios.get(
            'http://localhost:3000/api/job/get-all-job',
            {
                params : {
                    page,
                    limit,
                    keyword : search,
                    location,
                    jobType
                }
            },
            {
            withCredentials: true,
            }
        );

        setJobs(res.data.jobs);
        } catch (error) {
        console.log("Error", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page,search,location,jobType]);

    useEffect(() =>{
        setPage(1)
    },[search,jobType,location])

    useEffect(() =>{
        const delay = setTimeout(() => {
            fetchJobs()
        }, 500);

        return ()=> clearTimeout(delay)
    },[search])

    const handleDelete = async (jobId) =>{
        try {
            const res = await axios.delete(`http://localhost:3000/api/job/get-delete/${jobId}`,{
                withCredentials : true
            })

            toast.success(res.data.message)

            setJobs(prev => prev.filter((job) => job._id !== jobId))
        } catch (error) {
            console.log('Delete Error',error.response?.data)
            toast.error(error.response?.data?.message)
        }
    }
    // loading
    if (loading) {
        return <p className="text-center mt-10">Loading jobs...</p>;
    }

    return (
        <div className="flex gap-6 px-6 py-6">

        {/* ================= LEFT FILTER ================= */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>

            <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job..."
            className="w-full mb-3 px-3 py-2 border rounded"
            />

            <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded">
            <option value=''>All Location</option>
            <option>Banglore</option>
            <option>Delhi</option>
            <option>Nodia</option>
            <option>Gujrat</option>
            </select>

            <select 
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded">
            <option value=''>Job Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            </select>
        </div>

        {/* ================= RIGHT JOB LIST ================= */}
        <div className="w-3/4">

            {/* 🔝 TOP BAR */}
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
                {jobs.length} Jobs Found
            </h2>

            <select className="border px-2 py-1 rounded">
                <option>Latest</option>
                <option>Salary</option>
            </select>
            </div>

            {/* ❌ NO JOB */}
            {jobs.length === 0 && (
            <p className="text-center text-gray-500">No jobs found 😢</p>
            )}

            {/* ✅ JOB GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {jobs.map((job) => (
                <div
                key={job._id}
                className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >

                {/* 🔝 TOP */}
                <div className="flex items-center gap-3 mb-2">
                    <img
                    src={job.companyLogo?.url || "https://via.placeholder.com/50"}
                    alt="logo"
                    className="w-12 h-12 object-cover rounded-md border"
                    />

                    <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                        {job.companyName}
                    </p>
                    </div>
                </div>

                {/* 📍 LOCATION */}
                <p className="text-sm text-gray-500">
                    📍 {job.location}
                </p>

                {/* 📝 DESCRIPTION */}
                <p className="text-sm text-gray-600 mt-1">
                    {job.description?.slice(0, 80)}...
                </p>

                {/* 💰 SALARY */}
                <p className="text-sm text-green-600 font-semibold mt-2">
                    💰 ₹{job.salary?.min} - ₹{job.salary?.max}
                </p>

                {/* 🧠 EXPERIENCE */}
                <p className="text-xs text-gray-400">
                    Experience: {job.experienceLevel}
                </p>

                {/* 🛠 SKILLS */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {job.skillsRequired.map((skill, index) => (
                    <span
                        key={index}
                        className="text-xs bg-blue-100 px-2 py-1 rounded"
                    >
                        {skill}
                    </span>
                    ))}
                </div>

                {/*  USERS */}
                <div className="flex gap-2 mt-4">
                    { user?.role !== 'recruiter' && (
                        <>
                    <button onClick={() => handleApplyChange(job._id)} className="w-full py-2 text-center bg-orange-500 text-white rounded hover:bg-orange-600">
                    Apply
                    </button>

                    <button className="w-full py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50">
                    Details
                    </button>
                        </>
                    )}
                </div>

                {/* RECRUITER */}
                <div className="flex gap-2 mt-4">
                    {isAuthenticate && user.role === 'recruiter' && (
                        <>
                    <Link to={`/update-job/${job._id}`} className="w-full py-2 text-center bg-orange-500 text-white rounded hover:bg-orange-600">
                    Update
                    </Link>

                    <button onClick={() => handleDelete(job._id)}
                    className="w-full py-2 text-center border border-blue-500 text-blue-600 rounded hover:bg-blue-50">
                    Delete
                    </button>
                        
                        </>
                    )}
                </div>
                </div>
            ))}

            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-center mt-6 gap-2">

            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>

            <span className="px-3 py-1 bg-blue-500 text-white rounded">
                {page}
            </span>

            <button
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded"
            >
                Next
            </button>
            </div>

        </div>
        </div>
    );
    };

    export default Jobs;