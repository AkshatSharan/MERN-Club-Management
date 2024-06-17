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

export const createRound = async ({ roundName, roundDate, startTime, endTime, roundLocation, event }) => {
    try {
        const parsedStartTime = Date.parse(startTime);
        const parsedEndTime = Date.parse(endTime);

        if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
            throw new Error('Invalid date format for startTime or endTime');
        }

        const newRound = new EventRound({
            roundName,
            roundDate,
            startTime: new Date(parsedStartTime),
            endTime: new Date(parsedEndTime),
            roundLocation,
            event, // Reference to the UpcomingEvent
        });

        await newRound.save();
        return newRound;
    } catch (error) {
        console.error('Error creating event round:', error);
        throw new Error('Error creating event round');
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
