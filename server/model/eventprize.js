import mongoose from "mongoose";

const eventPrizeSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent',
        required: true,
    },
    positionName: String,
    certificate: Boolean,
    trophy: Boolean,
    cashPrize: Boolean,
    cashPrizeAmt: String,
});

eventPrizeSchema.post('remove', async function (doc) {
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

export default mongoose.model('EventPrize', eventPrizeSchema);