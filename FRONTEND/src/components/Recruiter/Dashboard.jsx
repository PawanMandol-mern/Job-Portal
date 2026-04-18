import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


const Dashboard = () => {
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState("all")
  
  // FETCH APPLICATIONS
  const fetchRecruiter = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/application/recruiter-application',
        { withCredentials: true }
      )

      setApplications(res.data.application)

    } catch (error) {
      console.log('Error', error)
    }
  }

  useEffect(() => {
    const initial =async () =>{
      await fetchRecruiter()
    }
    initial()
  }, [])

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/application/update-status/${id}`,
        { status },
        { withCredentials: true }
      )

      console.log('status',res.data.status)
      toast.success(res.data.message)
      
      fetchRecruiter()

    } catch (error) {
      console.log(error)
      toast.error("Error updating status")
    }
  }

  // FILTER LOGIC
  const filteredApplications = applications.filter((app) => {
    if (filter === "shortlist") return app.status === "Shortlist"
    if (filter === "reject") return app.status === "Reject"
    return true
  })

  // COUNTS
  const total = applications.length
  const shortlistCount = applications.filter(a => a.status === "Shortlist").length
  const rejectCount = applications.filter(a => a.status === "Reject").length

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-100 to-blue-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        📊 Recruiter Dashboard
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          All ({total})
        </button>

        <button
          onClick={() => setFilter("shortlist")}
          className={`px-4 py-2 rounded ${filter === "shortlist" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Shortlisted ({shortlistCount})
        </button>

        <button
          onClick={() => setFilter("reject")}
          className={`px-4 py-2 rounded ${filter === "reject" ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
          Rejected ({rejectCount})
        </button>
      </div>

      {/* EMPTY */}
      {filteredApplications.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No Applications Found 🚫
        </p>
      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition border"
            >

              {/* TOP: TITLE + STATUS */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-blue-600">
                  {app.jobId?.title || "No Title"}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-white text-xs
                  ${app.status === "Shortlist"
                      ? "bg-green-500"
                      : app.status === "Reject"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-1">
                {app.jobId?.companyName}
              </p>

              {/* USER INFO */}
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p><b>Name:</b> {app.name}</p>
                <p><b>Email:</b> {app.email}</p>
                <p><b>Phone:</b> {app.phone}</p>
                <p><b>Skills:</b> {app.skills}</p>
              </div>

              {/* COVER LETTER */}
              <p className="mt-3 text-gray-600 italic text-sm">
                "{app.coverLetter}"
              </p>

              {/* RESUME */}
              <a
                href={app.resume?.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline block mt-3 text-sm hover:text-blue-700"
              >
                📄 View Resume
              </a>

              {/* BUTTONS ONLY IF PENDING */}
              {app.status === "Applied" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => updateStatus(app._id, "Shortlist")}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    ✅ Accept
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Reject")}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default Dashboard