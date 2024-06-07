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
    password: {
        type: String,
        required: true,
    },
    displayDescription: String,
    clubDescription: String,
    recruitment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruitment',
    }]
});

export default mongoose.model("Club", clubSchema);
