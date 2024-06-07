import mongoose, { Schema } from "mongoose";

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
        type: Schema.ObjectId,
        ref: 'recruitment',
    }]
})

export default mongoose.model("club", clubSchema); 