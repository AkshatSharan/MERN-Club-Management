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

        // Add the new event to the club's upcoming events
        club.upcomingEvents.push(newEvent._id);
        await club.save();

        // Create event prizes and add to event
        const createdPrizes = await Promise.all(prizes.map(async (prize) => {
            const newPrize = await createEventPrize({ ...prize, event: newEvent._id });
            newEvent.prizes.push(newPrize._id); // Add prize ID to event's prizes array
            return newPrize;
        }));

        // Create event rounds and add to event
        const createdRounds = await Promise.all(rounds.map(async (round) => {
            const newRound = await createRound({ ...round, event: newEvent._id });
            newEvent.rounds.push(newRound._id); // Add round ID to event's rounds array
            return newRound;
        }));

        await newEvent.save(); // Save event with updated rounds and prizes

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
        const eventId = req.params.eventId;
        const event = await UpcomingEvent.findById(eventId).populate('club rounds prizes');

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.log("Error fetching details", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};