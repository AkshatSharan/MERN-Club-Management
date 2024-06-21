import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
    applicationStatus: {
        type: String,
        default: 'pending'
    },
    responses: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ApplicationForm.questions',
            required: true,
        },
        answer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    }],
});

export default mongoose.model('Application', applicationSchema);