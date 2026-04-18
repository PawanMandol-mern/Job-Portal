/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateJob = () => {
  const [title          , setTitle] = useState("");
  const [description    , setDescription] = useState("");
  const [companyName    , setCompanyName] = useState("");
  const [location       , setLocation] = useState("");
  const [jobType        , setJobType] = useState("");
  const [salary         , setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skillsRequired , setSkillsRequired] = useState("");
  const [companyLogo    , setCompanyLogo] = useState(null);
  const [preview, setPreview] = useState("");

  // ✅ IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCompanyLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ SUBMIT
  const fetchCreateJob = async (e) => {
    e.preventDefault();

    // 🔥 FILE VALIDATION
    if (!companyLogo) {
      toast.error("Please select company logo");
      return;
    }

    // 🔥 SALARY VALIDATION
    const [minSalary, maxSalary] = salary.split("-");

    if (!minSalary || !maxSalary) {
      toast.error("Enter salary like 3000-5000");
      return;
    }

    if (Number(minSalary) > Number(maxSalary)) {
      toast.error("Min salary cannot be greater than max salary");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("salary[min]", minSalary);
      formData.append("salary[max]", maxSalary);

      formData.append("title", title);
      formData.append("description", description);
      formData.append("companyName", companyName);
      formData.append("location", location);
      formData.append("jobType", jobType);
      formData.append("experienceLevel", experienceLevel);
      formData.append("skillsRequired", skillsRequired);
      formData.append("companyLogo", companyLogo);

      // 🔥 DEBUG
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await axios.post(
        "http://localhost:3000/api/job/job-create",
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Job Created 🚀");

    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-500 via-indigo-500 to-blue-500 p-4">

      <form
        onSubmit={fetchCreateJob}
        className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-xl space-y-4 text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-4">
          🎉 Create New Job
        </h1>

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <input
          type="text"
          placeholder="Experience Level"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <input
          type="text"
          placeholder="Salary (3000-5000)"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <input
          type="text"
          placeholder="Skills (React, Node)"
          value={skillsRequired}
          onChange={(e) => setSkillsRequired(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/30 text-white"
        >
          <option value="" className="text-black">
            Select Job Type
          </option>
          <option value="Full-time" className="text-black">
            Full-time
          </option>
          <option value="Part-time" className="text-black">
            Part-time
          </option>
        </select>

        <input
          type="file"
          onChange={handleImageChange}
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        )}

        <button
          type="submit"
          className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg"
        >
          🚀 Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;