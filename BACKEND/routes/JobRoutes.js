import express from "express"
import { deleteJob, getAllJob, getSingleJob, Jobcreate, updateJob } from "../Controllers/JobController.js"
import { AuthMid, isRecruiter } from "../middleware/AuhtMid.js"

const jobRoutes = express.Router()

jobRoutes.post('/job-create',AuthMid,isRecruiter,Jobcreate)

jobRoutes.get('/get-all-job',getAllJob)
jobRoutes.get('/get-single-job/:id',getSingleJob)

jobRoutes.put('/update-job/:id',AuthMid,isRecruiter,updateJob)

jobRoutes.delete('/get-delete/:id',AuthMid,isRecruiter,deleteJob)

export default jobRoutes