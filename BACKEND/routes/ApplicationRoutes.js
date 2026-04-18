import express from "express"
import { AuthMid, isRecruiter } from "../middleware/AuhtMid.js"
import { Apply, getDashboardStats, getMyApplications, getRecruiterApplications, updateApplicationStatus } from "../Controllers/ApplicationController.js"

const applicationRoutes = express.Router()

applicationRoutes.post("/apply-job/:id",AuthMid,Apply)

applicationRoutes.get("/view-my-application",AuthMid,getMyApplications)

applicationRoutes.get("/recruiter-application",AuthMid,isRecruiter,getRecruiterApplications)

applicationRoutes.put("/update-status/:id",AuthMid,isRecruiter,updateApplicationStatus)

applicationRoutes.get("/dashboard-status",AuthMid,isRecruiter,getDashboardStats)

export default applicationRoutes;