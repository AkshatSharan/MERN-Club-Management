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

export const updateRound = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRound = await EventRound.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRound) {
            return res.status(404).json({ error: 'Round not found' });
        }

        res.status(200).json(updatedRound);
    } catch (error) {
        console.error('Error updating round:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete an existing round
export const deleteRound = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRound = await EventRound.findByIdAndDelete(id);

        if (!deletedRound) {
            return res.status(404).json({ error: 'Round not found' });
        }

        res.status(200).json({ message: 'Round deleted successfully' });
    } catch (error) {
        console.error('Error deleting round:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
