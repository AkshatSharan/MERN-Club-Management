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

export default mongoose.model('EventPrize', eventPrizeSchema);