import { v2 as cloudinary } from 'cloudinary'
import JobModel from '../Module/JobModel.js';


// ================== CREATE JOB ==================
export const Jobcreate = async (req , res) =>{

    try {
        if(!req.files || !req.files.companyLogo){
            return res.status(400).json({
                message : "company logo is required",
                success : false
            })
        }

        const { companyLogo } = req.files;

        if (companyLogo.size > 2 * 1024 * 1024) {
            return res.status(400).json({
                message: "File size should be less than 2MB",
                success: false
            });
        }

        const allowFormat = ['image/jpeg','image/png','image/avif','image/webp'];

        if(!allowFormat.includes(companyLogo.mimetype)){
            return res.status(400).json({
                message : "Only jpeg/png/avif/webp allowed",
                success : false
            })
        }

        const result = await cloudinary.uploader.upload(companyLogo.tempFilePath);

        const {
            title,
            description,
            companyName,
            location,
            jobType,
            experienceLevel
        } = req.body;

        const salary = {
            min: Number(req.body['salary[min]']),
            max: Number(req.body['salary[max]'])
        };

        const skillsRequired = req.body.skillsRequired
            ? req.body.skillsRequired.split(",").map(s => s.trim())
            : [];

        if(
            !title ||
            !description ||
            !companyName ||
            !location ||
            !jobType ||
            salary.min == null ||
            salary.max == null ||
            !experienceLevel ||
            skillsRequired.length === 0
        ){
            return res.status(400).json({
                message : "All fields are required",
                success : false
            })
        }

        const job = await JobModel.create({
            title,
            description,
            companyName,
            location,
            jobType,
            salary,
            experienceLevel,
            skillsRequired,
            createdBy: req.userId,
            companyLogo : {
                public_id : result.public_id,
                url : result.secure_url
            }
        })

        return res.status(201).json({
            message :"job created successfully",
            success : true,
            job
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            success: false
        });
    }
}


// ================== GET ALL JOB (FILTER + PAGINATION) ==================
export const getAllJob = async (req , res) =>{
    try {
        const {
            keyword,
            location,
            minSalary,
            maxSalary,
            jobType,
            page,
            limit
        } = req.query;

        const currentPage = Number(page) || 1;
        const perPage = Number(limit) || 10;
        const skip = (currentPage - 1) * perPage;

        let filter = {};

        if(keyword){
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { companyName: { $regex: keyword, $options: "i" } }
            ];
        }

        if(location){
            filter.location = { $regex: location, $options: "i" };
        }

        if(minSalary || maxSalary){
            filter.salary = {};

            if(minSalary){
                filter.salary.min = { $gte: Number(minSalary) };
            }

            if(maxSalary){
                filter.salary.max = { $lte: Number(maxSalary) };
            }
        }

        if(jobType){
            filter.jobType = jobType;
        }

        const jobs = await JobModel.find(filter)
            .skip(skip)
            .limit(perPage)
            .sort({ createdAt: -1 });

        const totalJobs = await JobModel.countDocuments(filter);
        const totalPages = Math.ceil(totalJobs / perPage);

        if(totalJobs === 0){
            return res.status(200).json({
                success: true,
                message: "No jobs found",
                page: currentPage,
                totalJobs: 0,
                totalPages: 0,
                jobs: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            page: currentPage,
            limit: perPage,
            totalJobs,
            totalPages,
            jobs
        });

    } catch (error) {
        return res.status(500).json({
            error : error.message,
            success : false
        })
    }
}

export const getSingleJob = async (req , res) =>{
    try {
        // const id = req.params;

        const job = await JobModel.findById(req.params.id)

        if(!job){
            return res.status(403).json({
                message : "Job not found",
                success : false
            })
        }

        return res.status(200).json({
            message : "Job found successfully",
            success : true,
            job
        })
    } catch (error) {
        return res.status(500).json({
            error : error.message ||"server error",
            success : false
        })
    }
}

// ================== UPDATE JOB ==================
export const updateJob = async (req ,res) =>{
    try {
        const jobId = req.params.id;

        const job = await JobModel.findById(jobId);

        if(!job){
            return res.status(404).json({
                message : "Job not found",
                success : false
            })
        }

        if(job.createdBy.toString() !== req.userId){
            return res.status(403).json({
                message :"Unauthorized",
                success : false
            })
        }

        let companyData = job.companyLogo;

        if(req.files?.companyLogo){

            const companyLogo = req.files.companyLogo;

            if(companyLogo.size > 2 * 1024 *1024){
                return res.status(400).json({
                    message : "File size should be less than 2MB",
                    success : false
                })
            }

            const allowFormat = ['image/jpeg','image/png','image/avif','image/webp'];

            if(!allowFormat.includes(companyLogo.mimetype)){
                return res.status(400).json({
                    message: "Only jpeg/png/avif/webp allowed",
                    success: false
                });
            }

            if(job.companyLogo?.public_id){
                await cloudinary.uploader.destroy(job.companyLogo.public_id)
            }

            const result = await cloudinary.uploader.upload(companyLogo.tempFilePath)

            companyData = {
                public_id : result.public_id,
                url : result.secure_url
            }
        }

        const updateData = {...req.body};

        if(req.body['salary[min]'] && req.body['salary[max]']){
            updateData.salary = {
                min : Number(req.body['salary[min]']),
                max : Number(req.body['salary[max]'])
            }
        }

        if(req.body.skillsRequired){
            updateData.skillsRequired = req.body.skillsRequired
                .split(",")
                .map(s => s.trim());
        }

        updateData.companyLogo = companyData;

        const updatedJob = await JobModel.findByIdAndUpdate(
            jobId,
            updateData,
            {new : true}
        )

        return res.status(200).json({
            message : 'job updated successfully',
            success : true,
            job: updatedJob
        })

    } catch (error) {
        return res.status(500).json({
            error : error.message,
            success : false
        })
    }
}


// ================== DELETE JOB ==================
export const deleteJob = async (req , res) =>{
    try {
        const jobId = req.params.id;

        const job = await JobModel.findById(jobId);

        if(!job){
            return res.status(404).json({
                message : "job not found",
                success : false
            })
        }

        if(job.createdBy.toString() !== req.userId){
            return res.status(403).json({
                message : "Unauthorized",
                success : false
            })
        }

        if(job.companyLogo?.public_id){
            await cloudinary.uploader.destroy(job.companyLogo.public_id)
        }

        await JobModel.findByIdAndDelete(jobId)

        return res.status(200).json({
            message : 'job deleted successfully',
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            error : error.message,
            success : false
        })
    }
}