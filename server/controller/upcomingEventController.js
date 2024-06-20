import UpcomingEvent from '../model/upcomingevent.js';
import EventRound from '../model/eventround.js'
import EventPrize from '../model/eventprize.js';
import Club from '../model/club.js'
import { createEventPrize } from './eventPrizeController.js';
import { createRound } from './eventRoundController.js';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { stripHtml } from 'string-strip-html';

export const createUpcomingEvent = async (req, res) => {
    try {
        const { eventTitle, participation, registrationDeadline, coverDescription, teamSize, eventDescription, rounds, prizes, registrationFees } = req.body;

        const window = new JSDOM('').window;
        const DOMPurifyInstance = DOMPurify(window);

        const sanitizedEventDescription = DOMPurifyInstance.sanitize(eventDescription, {
            ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'p', 'ul', 'ol', 'li', 'blockquote'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
        });

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
            eventDescription: sanitizedEventDescription,
            registrationFees,
            club: club._id,
        });

        await newEvent.save();

        club.upcomingEvents.push(newEvent._id);
        await club.save();

        const createdPrizes = await Promise.all(prizes.map(async (prize) => {
            const newPrize = await createEventPrize({ ...prize, event: newEvent._id });
            newEvent.prizes.push(newPrize._id);
            return newPrize;
        }));

        const createdRounds = await Promise.all(rounds.map(async (round) => {
            const newRound = await createRound({ ...round, event: newEvent._id });
            newEvent.rounds.push(newRound._id);
            return newRound;
        }));

        await newEvent.save();

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

export const getEventManagementDetails = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await UpcomingEvent.findById(eventId)
            .populate({
                path: 'club',
            })
            .populate({
                path: 'registrationForm',
            })
            .populate({
                path: 'registrations',
                populate: {
                    path: 'student',
                    select: '-_id -password -refreshToken',
                },
            });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching details:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const toggleRegistrationStatus = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        const event = await UpcomingEvent.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        event.registrationsOpen = !event.registrationsOpen;
        await event.save();

        res.status(200).json({
            message: 'Registration status toggled successfully',
            event: event,
        });
    } catch (error) {
        console.error('Error toggling registration status:', error);
        res.status(500).json({ error: 'Error toggling registration status' });
    }
}

export const updateUpcomingEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const {
            eventTitle, participation, registrationDeadline, coverDescription,
            teamSize, eventDescription, rounds, prizes, registrationFees
        } = req.body;

        const window = new JSDOM('').window;
        const DOMPurifyInstance = DOMPurify(window);

        const sanitizedEventDescription = DOMPurifyInstance.sanitize(eventDescription, {
            ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'p', 'ul', 'ol', 'li', 'blockquote'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
        });

        const updatedEvent = await UpcomingEvent.findByIdAndUpdate(
            eventId,
            {
                eventTitle,
                participation,
                registrationDeadline,
                coverDescription,
                teamSize,
                eventDescription: sanitizedEventDescription,
                registrationFees,
            },
            { new: true }
        ).populate('rounds prizes');

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (rounds && rounds.length > 0) {
            updatedEvent.rounds = [];
            await Promise.all(rounds.map(async (round) => {
                const newRound = await createRound({ ...round, event: eventId });
                updatedEvent.rounds.push(newRound._id);
            }));
        }

        if (prizes && prizes.length > 0) {
            updatedEvent.prizes = [];
            await Promise.all(prizes.map(async (prize) => {
                const newPrize = await createEventPrize({ ...prize, event: eventId });
                updatedEvent.prizes.push(newPrize._id);
            }));
        }

        await updatedEvent.save();

        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent,
        });
    } catch (error) {
        console.error('Error updating upcoming event:', error);
        res.status(500).json({ error: 'Error updating upcoming event' });
    }
};