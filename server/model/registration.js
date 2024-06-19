import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent',
        required: true,
    },
    formData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegistrationForm',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    responses: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RegistrationForm.questions',
            required: true,
        },
        answer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Registration', registrationSchema);
