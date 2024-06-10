import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true,
    },
    clubLogo: {
        type: String,
        required: false,
    },
    clubEmail: String,
    password: String,
    displayDescription: String,
    clubDescription: String,
    recruitment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruitment',
    }],
    upcomingEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent'
    }]
});

export default mongoose.model("Club", clubSchema);
