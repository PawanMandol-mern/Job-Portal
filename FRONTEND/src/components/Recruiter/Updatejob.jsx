import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const Updatejob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyName: "",
    location: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    experienceLevel: "",
    skillsRequired: "",
  });

  // FETCH JOB 
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/job/get-single-job/${id}`
        );

        const job = res.data.job;

        setFormData({
          title: job.title || "",
          description: job.description || "",
          companyName: job.companyName || "",
          location: job.location || "",
          jobType: job.jobType || "",
          experienceLevel: job.experienceLevel || "",
          skillsRequired: job.skillsRequired?.join(", ") || "",
          minSalary: job.salary?.min || "",
          maxSalary: job.salary?.max || "",
        });

      } catch (error) {
        console.log("Fetch Error:", error.response?.data);
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  //  HANDLE CHANGE 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //UPDATE JOB
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/api/job/update-job/${id}`,
        {
          title: formData.title,
          description: formData.description,
          companyName: formData.companyName,
          location: formData.location,
          jobType: formData.jobType,
          experienceLevel: formData.experienceLevel,

          // ✅ correct format
          "salary[min]": Number(formData.minSalary),
          "salary[max]": Number(formData.maxSalary),

          skillsRequired: formData.skillsRequired,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      // ✅ redirect after update
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.log("Update Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // LOADING 
  if (loading) {
    return <p className="text-center mt-10">Loading job data...</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Update Job</h2>

      <form onSubmit={handleUpdate} className="space-y-3">

        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2" />

        <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company" className="w-full border p-2" />

        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2" />

        <input name="jobType" value={formData.jobType} onChange={handleChange} placeholder="Job Type" className="w-full border p-2" />

        <input name="minSalary" value={formData.minSalary} onChange={handleChange} placeholder="Min Salary" className="w-full border p-2" />

        <input name="maxSalary" value={formData.maxSalary} onChange={handleChange} placeholder="Max Salary" className="w-full border p-2" />

        <input name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} placeholder="Experience" className="w-full border p-2" />

        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />

        <input name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full border p-2" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Update Job
        </button>

      </form>
    </div>
  );
};

export default Updatejob;