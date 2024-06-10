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

export const getUpcomingEventDetails = async (req, res) => {
    try {
        const eventId = req.params.eventId
        const event = await UpcomingEvent.findById(eventId).populate('club')

        if (!event) {
            return res.status(404).json({ error: 'Event not found' })
        }

        res.status(200).json(event);
    } catch (error) {
        console.log("Error fetching details", error)
        res.status(500).json({ error: 'Internal server error' });
    }
}