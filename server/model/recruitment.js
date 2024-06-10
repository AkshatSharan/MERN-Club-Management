import mongoose from "mongoose";

const twoWeeksFromNow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
};

const recruitmentSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    accepting: {
        type: Boolean,
        default: false
    },
    applicationDeadline: {
        type: Date,
        default: twoWeeksFromNow,
        required: false,
    },
    recruitmentTitle: String,
    applicationDetail: String,
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }]
});

export default mongoose.model('Recruitment', recruitmentSchema);
