import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from "react-router-dom"

const ApplyJob = () => {
  const [resume, setResume] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [skills, setSkills] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  const { id } = useParams() // ✅ correct

  const navigation = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setResume(file)
  }

  const fetchApplyJob = async (e) => {
    e.preventDefault() // ✅ important

    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('skills', skills)
      formData.append('coverLetter', coverLetter)
      formData.append('resume', resume) // ✅ important

      const res = await axios.post(
        `http://localhost:3000/api/application/apply-job/${id}`,
        formData, // ✅ correct variable
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      toast.success(res?.data?.message || "Job Apply successfully")
      navigation('/')
    } catch (error) {
      console.log('Error', error)
      toast.error(error?.response?.data || "Error in apply")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-200 px-4">
  
  <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6">
    
    <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
      Apply for Job 🚀
    </h1>

    <form onSubmit={fetchApplyJob} className="space-y-4">

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Full Name'
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Skills (React, Node...)"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Cover Letter"
        rows="4"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* FILE INPUT */}
      <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          Upload Resume (PDF only)
        </p>
      </div>

      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300'
      >
        Apply Now
      </button>

    </form>
  </div>
</div>
  )
}

export default ApplyJob