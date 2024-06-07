import UpcomingEvent from '../model/upcomingevent.js';
import Club from '../model/club.js';

export const createUpcomingEvent = async (req, res) => {
    try {
        const { clubId, eventTitle, eventDescription, registrationsOpen, registrationDeadline, eventStartDate } = req.body;

        const newEvent = new UpcomingEvent({
            club: clubId,
            eventTitle,
            eventDescription,
            registrationsOpen,
            registrationDeadline,
            eventStartDate
        });

        const savedEvent = await newEvent.save();

        await Club.findByIdAndUpdate(
            clubId,
            { $push: { upcomingEvents: savedEvent._id } },
            { new: true }
        );

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating upcoming event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUpcomingEvents = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error creating upcoming event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};