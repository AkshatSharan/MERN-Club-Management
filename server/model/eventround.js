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

eventRoundSchema.post('remove', async function (doc) {
    const UpcomingEvent = mongoose.model('UpcomingEvent');
    try {
        await UpcomingEvent.findByIdAndUpdate(doc.event, {
            $pull: { rounds: doc._id }
        });
    } catch (error) {
        console.error('Error updating UpcomingEvent after removing round:', error);
        throw error;
    }
});

export default mongoose.model('EventRound', eventRoundSchema)