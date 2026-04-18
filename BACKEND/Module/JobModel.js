import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    companyName: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    jobType: {
        type: String,
        required: true,
        enum: ["Full-time", "Part-time", "Internship", "Remote"]
    },

    salary: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },

    experienceLevel: {
        type: String,
        required: true
    },

    skillsRequired: [
        {
            type: String,
            required: true
        }
    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    applicantsCount: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },
    companyLogo: {
        public_id: {
            type: String
        },
        url: {
            type: String
    }
}

}, { timestamps: true });

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;