import mongoose from "mongoose";

const twoWeeksFromNow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
};
const threeWeeksFromNow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 21);
    return date;
};

const upcomingEventSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    eventTitle: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        default: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.",
    },
    registrationsOpen: {
        type: Boolean,
        default: true
    },
    registrationDeadline: {
        type: Date,
        default: twoWeeksFromNow,
        required: false,
    },
    eventStartDate: {
        type: Date,
        default: threeWeeksFromNow,
        required: false,
    },
    participation: {
        type: String,
        default: 'individual',
    },
    eventLocation: String,
    registrationFees: {
        type: String,
        default: 'Free',
    },
    rounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventRound'
    }],
    prizes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventPrizes'
    }],
    organizers: [{
        name: String,
        phoneNumber: String
    }],
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration'
    }],
});

export default mongoose.model('UpcomingEvent', upcomingEventSchema);
