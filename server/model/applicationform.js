import mongoose from 'mongoose';

const applicationFormSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    formTitle: {
        type: String,
        required: true
    },
    formDescription: {
        type: String
    },
    questions: [
        {
            type: {
                type: String,
                enum: ['text', 'textarea', 'radio', 'checkbox', 'select'],
                required: true
            },
            question: {
                type: String,
                required: true
            },
            options: [String]
        }
    ]
});

export default mongoose.model('ApplicationForm', applicationFormSchema);