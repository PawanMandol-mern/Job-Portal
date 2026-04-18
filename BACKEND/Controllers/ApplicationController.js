import ApplicationModel from "../Module/ApplicationModel.js";
import JobModel from "../Module/JobModel.js";
import { v2 as cloudinary } from 'cloudinary'

export const Apply = async (req , res) =>{
    try {
        const userId = req.userId;
        const jobId = req.params.id;
        
        const ApplyJob = await JobModel.findById(jobId);
        
        if(!ApplyJob){
            return res.status(403).json({
                message :'Job not found',
                success : false
            })
        }
        
        const alreadyApplied = await ApplicationModel.findOne({userId,jobId})
        
        if(alreadyApplied){
            return res.status(400).json({
                message : "You applied already this job",
                success : false
            })
        }
        
        if(!req.files && !req.files.resume){
            return res.status(400).json({
                message : "resume is required",
                success : false
            })
        }
        
        const {resume} = req.files;
        
        if(req.files.size > 2 *1024 *1024){
            return res.status(400).json({
                message :"Resume size should be less then 2MB",
                success : false
            })
        }
        
        if(resume.mimetype !== 'application/pdf'){
            return res.status(400).json({
                message : "Only PDF allow",
                success : false
            })
        }
        
        const result =await  cloudinary.uploader.upload(resume.tempFilePath,{
            resource_type : "raw"
        })
        
        const {name,email,phone,skills,coverLetter}=req.body;

        if(!name || !email || !phone || !skills || !coverLetter){
            return res.status(403).json({
                message : "All fields are required",
                success : false
            })
        }

        const application = await ApplicationModel.create({
            userId,
            jobId,
            resume : {
                public_id : result.public_id,
                url : result.secure_url
            },
                name,
                email,
                phone,
                skills,
                coverLetter
            
        })

        await JobModel.findByIdAndUpdate(jobId,{
            $inc:{applicantsCount : 1}
        })

        return res.status(200).json({
            message : "job Apply successfully",
            success : true,
            application
        })

    } catch (error) {
        return res.status(500).json({
            error : error.message || "Error in Apply job",
            success : false
        })
    }
}

export const getMyApplications  = async (req , res) =>{
    try {
        const userId = req.userId
        
        const viewjob = await ApplicationModel.find({userId}).populate("jobId")

        return res.status(200).json({
            message :"All job here",
            success : true,
            viewjob
        })
    }catch (error) {
        return res.status(500).json({
            error : error.message || "Error in view job",
            success : false
        })
    }
}

export const getRecruiterApplications  = async (req , res) =>{
    try {
        const recruiterId = req.userId;

        const jobs = await JobModel.find({createdBy : recruiterId})

        const jobIds = jobs.map(job => job._id) 

        const application = await ApplicationModel.find({
            jobId : {$in : jobIds}
        })
        .populate('userId')
        .populate('jobId')

        return res.status(200).json({
            success : true,
            application
        })

    } catch (error) {
        return res.status(500).json({
            error : error.message || "Error in view job",
            success : false
        })
    }
}

export const updateApplicationStatus = async (req ,res) =>{
    try {
        const recruiterId = req.userId;
        const applicationId = req.params.id;

        const {status} = req.body;

        const allowedStatus = ['Shortlist','Reject']
        if(!allowedStatus){
            return res.status(400).json({
                message :"Invalid status",
                success : false
            })
        }

        const application = await ApplicationModel.findById(applicationId).populate("jobId")

        if(!application){
            return res.status(404).json({
                message :"application not found",
                success : false
            })
        }

        if(application.jobId.createdBy.toString() !== recruiterId){
            return res.status(403).json({
                message : "Unautherized",
                success : false
            })
        }

        application.status= status;
        await application.save()

        return res.status(200).json({
            message : `Application ${status}`,
            success : true,
            application
        })
    } catch (error) {
        return res.status(500).json({
            error : error.message
        })
    }
}

export const getDashboardStats  = async (req , res) =>{
    try {
        const recruiterId = req.userId;

        //total jobs
        const totalJobs = await JobModel.countDocuments({
            createdBy : recruiterId
        })

        //recruiter jobs
        const jobs = await JobModel.find({
            createdBy : recruiterId
        }).select("_id")

        const jobIds = jobs.map(job => job._id)

        //total applicant
        const totalApplicant = await ApplicationModel.countDocuments({
            jobId : {$in : jobIds}
        })

        //shortlist
        const shortlist = await ApplicationModel.countDocuments({
            jobId : {$in : jobIds},
            status :"Shortlist"
        })

        const rejected = await ApplicationModel.countDocuments({
            jobId : {$in : jobIds},
            status : "Rejected"
        })

        return res.status(200).json({
            success : true,
            status :{
                totalJobs,
                totalApplicant,
                shortlist,
                rejected
            }
        })
    } catch (error) {
        return res.status(500).json({
            error : error.message
        })
    }
}
