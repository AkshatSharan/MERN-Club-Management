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
            event,
        });

        await newPrize.save();
        return newPrize;
    } catch (error) {
        console.error('Error creating event prize:', error);
        throw new Error('Error creating event prize');
    }
};

export const updatePrize = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPrize = await EventPrize.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPrize) {
            return res.status(404).json({ error: 'Prize not found' });
        }

        res.status(200).json(updatedPrize);
    } catch (error) {
        console.error('Error updating prize:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deletePrize = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPrize = await EventPrize.findByIdAndDelete(id);

        if (!deletedPrize) {
            return res.status(404).json({ error: 'Prize not found' });
        }

        res.status(200).json({ message: 'Prize deleted successfully' });
    } catch (error) {
        console.error('Error deleting prize:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};