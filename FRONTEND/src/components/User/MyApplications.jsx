/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/application/view-my-application",
        { withCredentials: true }
      );
      setApplications(res.data.viewjob);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyApplications();

    const interval = setInterval(() => {
      fetchMyApplications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        My Applications 🚀
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 border"
          >
            {/* Job Title */}
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {app.jobId?.title}
            </h2>

            {/* Company */}
            <p className="text-gray-700">
              <span className="font-medium">Company:</span>{" "}
              {app.jobId?.company}
            </p>

            {/* Location */}
            <p className="text-gray-700 mb-3">
              <span className="font-medium">Location:</span>{" "}
              {app.jobId?.location}
            </p>

            {/* Status Badge */}
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full font-medium
                ${
                  app.status === "Applied"
                    ? "bg-gray-200 text-gray-700"
                    : app.status === "Shortlisted"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }
              `}
            >
              {app.status}
            </span>

            {/* Resume Button */}
            <div className="mt-4">
              <a
                href={app.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              >
                View Resume
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;