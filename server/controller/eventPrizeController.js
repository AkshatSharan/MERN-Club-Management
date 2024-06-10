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

export const createEventPrize = async (req, res) => {
    try {
        const { event, positionName, certificate, trophy, cashPrize, cashPrizeAmt } = req.body;
        const newEventPrize = new EventPrize({
            event,
            positionName,
            certificate,
            trophy,
            cashPrize,
            cashPrizeAmt,
        });

        const createdEventPrize = await newEventPrize.save();
        const upcomingEvent = await UpcomingEvent.findById(event);

        if (!upcomingEvent) {
            return res.status(404).json({ message: "Upcoming event not found" });
        }

        upcomingEvent.prizes.push(createdEventPrize._id);
        await upcomingEvent.save();
        res.status(201).json(createdEventPrize);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
