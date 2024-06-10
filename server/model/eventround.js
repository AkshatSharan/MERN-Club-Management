import mongoose, { Schema } from "mongoose";

const eventRoundSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent',
        required: true,
    },
    roundName: String,
    roundDate: Date,
    startTime: Date,
    endTime: Date,
    roundLocation: String,
})

export default mongoose.model('EventRound', eventRoundSchema)