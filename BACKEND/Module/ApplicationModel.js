import mongoose, { mongo } from "mongoose";

const applicationSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone :{
        type : String,
        required : true
    },
    skills :{
        type : String,
        required : true,
    },
    coverLetter : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    jobId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
        required : true
    },
    resume : {
            public_id :{
                type : String,
                requied : true
            },
            url : {
                type : String,
                requied : true
            }
        },
    status : {
        type : String,
        enum : ['Applied','Shortlist','Reject'],
        default : "Applied",
        required : true
    }
},{timestamps : true})

const ApplicationModel = mongoose.model("Application",applicationSchema)
export default ApplicationModel