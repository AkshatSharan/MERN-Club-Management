import UpcomingEvent from '../model/upcomingevent.js';
import EventRound from '../model/eventround.js'
import EventPrize from '../model/eventprize.js';
import Club from '../model/club.js'
import { createEventPrize } from './eventPrizeController.js';
import { createRound } from './eventRoundController.js';

export const createUpcomingEvent = async (req, res) => {
    try {
        const { eventTitle, participation, registrationDeadline, coverDescription, teamSize, eventDescription, rounds, prizes, registrationFees } = req.body;

        const club = await Club.findById(req.club._id);
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }

        const newEvent = new UpcomingEvent({
            eventTitle,
            participation,
            registrationDeadline,
            coverDescription,
            teamSize,
            eventDescription,
            registrationFees,
            club: club._id,
        });

        await newEvent.save();

        // Create event prizes
        const createdPrizes = await Promise.all(prizes.map(prize =>
            createEventPrize({ ...prize, event: newEvent._id })
        ));
        console.log(req.body);
        // Create event rounds
        const createdRounds = await Promise.all(rounds.map(round =>
            createRound({ ...round, event: newEvent._id })
        ));

        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
            prizes: createdPrizes,
            rounds: createdRounds,
        });
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