const mongoose = require('mongoose');
const { Schema } = mongoose;

const registrationSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'UpcomingEvent',
        required: true
    },
});

export default mongoose.model('Registration', registrationSchema);