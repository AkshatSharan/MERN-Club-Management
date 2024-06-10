import EventRound from "../model/eventround.js";
import UpcomingEvent from "../model/upcomingevent.js";

export const getEventRounds = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventRounds = await EventRound.find({ event: eventId });
        res.status(200).json(eventRounds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEventRound = async (req, res) => {
    try {
        const { event, roundName, roundDate, startTime, endTime, roundLocation } = req.body;
        const newEventRound = new EventRound({
            event,
            roundName,
            roundDate,
            startTime,
            endTime,
            roundLocation,
        });
        const createdEventRound = await newEventRound.save();
        const upcomingEvent = await UpcomingEvent.findById(event);

        if (!upcomingEvent) {
            return res.status(404).json({ message: "Upcoming event not found" });
        }

        upcomingEvent.rounds.push(createdEventRound._id);
        await upcomingEvent.save();
        res.status(201).json(createdEventRound);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEventRound = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEventRound = await EventRound.findByIdAndDelete(id);

        if (!deletedEventRound) {
            return res.status(404).json({ message: "Event round not found" });
        }

        const upcomingEvents = await UpcomingEvent.find({ rounds: id });
        upcomingEvents.forEach(async (event) => {
            event.rounds = event.rounds.filter((round) => round.toString() !== id);
            await event.save();
        });

        res.status(200).json({ message: "Event round deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
