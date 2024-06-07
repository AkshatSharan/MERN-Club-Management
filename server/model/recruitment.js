import mongoose, { Schema } from "mongoose";

const recruitmentSchema = new mongoose.Schema({
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    applicationDetail: String,
    applications: [{
        type: Schema.ObjectId,
        ref: "Application"
    }],
})

export default mongoose.model('Recruitment', recruitmentSchema);