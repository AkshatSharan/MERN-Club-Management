const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recruitment: {
        type: Schema.Types.ObjectId,
        ref: 'Recruitment',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under review', 'selected', 'rejected'],
        default: 'pending'
    },
});

export default mongoose.model('Application', applicationSchema);