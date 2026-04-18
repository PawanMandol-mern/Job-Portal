import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        min : 6,
        max : 10
    },
    role : {
        type : String,
        enum : ['user','recruiter'],
        default :"user"
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    otp : {
        type : String
    },
    otpExpire : {
        type : Date
    },
    resetOtp : {
        type : String
    },
    resetOtpExpire : {
        type : Date
    }
}, {timestamps : true})

const UserModule = mongoose.model('User',userSchema)
export default UserModule