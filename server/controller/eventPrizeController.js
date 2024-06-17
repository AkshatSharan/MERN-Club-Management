import EventPrize from "../model/eventprize.js";
import UpcomingEvent from "../model/upcomingevent.js";

export const getEventPrizes = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventPrizes = await EventPrize.find({ event: eventId });
        res.status(200).json(eventPrizes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEventPrize = async ({ positionName, certificate, trophy, cashPrize, cashPrizeAmt, event }) => {
    try {
        const newPrize = new EventPrize({
            positionName,
            certificate,
            trophy,
            cashPrize,
            cashPrizeAmt,
            event, // Reference to the UpcomingEvent
        });

        await newPrize.save();
        return newPrize;
    } catch (error) {
        console.error('Error creating event prize:', error);
        throw new Error('Error creating event prize');
    }
};

export const deleteEventPrize = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEventPrize = await EventPrize.findByIdAndDelete(id);

        if (!deletedEventPrize) {
            return res.status(404).json({ message: "Event prize not found" });
        }

        const upcomingEvents = await UpcomingEvent.find({ prizes: id });
        for (const event of upcomingEvents) {
            event.prizes = event.prizes.filter(prize => prize.toString() !== id);
            await event.save();
        }

        res.status(200).json({ message: "Event prize deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
