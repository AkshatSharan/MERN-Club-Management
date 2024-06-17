import UpcomingEvent from '../model/upcomingevent.js';
import EventRound from '../model/eventround.js'
import EventPrize from '../model/eventprize.js';
import Club from '../model/club.js'

export const createUpcomingEvent = async (req, res) => {
    try {
        const { eventTitle, participation, registrationDeadline, coverDescription, teamSize, eventDescription, rounds, prizes, registrationFees } = req.body;

        const club = await Club.findById(req.club._id);
        if (!club) {
        console.log("club not found")

            return res.status(404).json({ error: 'Club not found' });
        }

        const newEvent = new UpcomingEvent({
            eventTitle,
            participation,
            registrationDeadline,
            coverDescription,
            teamSize,
            eventDescription,
            rounds,
            prizes,
            registrationFees,
            club: club._id, // Assign the club reference
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating upcoming event:', error);
        res.status(500).json({ error: 'Error creating upcoming event' });
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