const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    recruitment: {
        type: Schema.Types.ObjectId,
        ref: 'recruitment',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under review', 'selected', 'rejected'],
        default: 'pending'
    },
});

export default mongoose.model('application', applicationSchema);