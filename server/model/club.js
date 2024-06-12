import mongoose from "mongoose";
import crypto from 'crypto'

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true,
    },
    clubLogo: {
        type: String,
        required: false,
    },
    clubEmail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayDescription: String,
    clubDescription: String,
    recruitment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruitment',
    }],
    upcomingEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent'
    }],
    clubSecret: {
        type: String,
        unique: true,
    },
});
clubSchema.pre('save', function (next) {
    if (!this.clubSecret) {
        const secureRandomString = crypto.randomBytes(20).toString('hex');
        this.clubSecret = secureRandomString;
    }
    next();
});

export default mongoose.model("Club", clubSchema);
