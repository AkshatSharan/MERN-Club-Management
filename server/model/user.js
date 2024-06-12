import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    collegeRegistration: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    applications: [{
        type: Schema.ObjectId,
        ref: "Application"
    }]
}, { timestamps: true })

export default mongoose.model("User", userSchema);