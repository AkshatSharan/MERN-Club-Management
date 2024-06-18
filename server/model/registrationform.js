import mongoose from 'mongoose';

const registrationFormSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent',
        required: true,
    },
    formTitle: {
        type: String,
        required: true,
    },
    formDescription: {
        type: String,
    },
    questions: [{
        type: {
            type: String,
            enum: ['text', 'textarea', 'radio', 'checkbox', 'select', 'textarea'],
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        options: [{ type: String }],
    }],
})

export default mongoose.model('RegistrationForm', registrationFormSchema)