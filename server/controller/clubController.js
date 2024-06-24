import Club from "../model/club.js";
import jwt from 'jsonwebtoken'

export const getAllClubs = async (req, res) => {
    try {
        const clubData = await Club.find()

        if (!clubData) {
            return res.status(404).json({ msg: "user data not found" })
        }

        res.status(200).json(clubData)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}

export const getClubsWithUpcomingEvents = async (req, res) => {
    try {
        const clubs = await Club.find({ upcomingEvents: { $exists: true, $not: { $size: 0 } } })
            .populate('upcomingEvents')
            .select('-password');

        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error retrieving clubs with upcoming events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateClub = async (req, res) => {
    const updateData = req.body;

    try {
        if (!req.club?._id) {
            return res.status(400).json({ error: 'Club not authenticated' });
        }

        const updatedClub = await Club.findByIdAndUpdate(req.club._id, updateData, { new: true });

        if (!updatedClub) {
            return res.status(404).json({ error: 'Club not found' });
        }

        res.status(200).json({ message: 'Club updated successfully', club: updatedClub });
    } catch (error) {
        console.error('Update club error:', error);
        res.status(500).json({ error: 'An error occurred while updating club' });
    }
}

export const getUpcomingEvents = async (req, res) => {
    try {
        const clubId = req.club?._id;

        if (!clubId) {
            return res.status(401).json({ error: "Club not authenticated" })
        }

        const club = await Club.findById(clubId).populate('upcomingEvents').select('-password -refreshToken')

        if (!club) {
            return res.status(404).json({ error: "Club not found" })
        }

        res.status(200).json({ upcomingEvents: club.upcomingEvents })
    } catch (error) {
        console.error('Error retrieving upcoming events:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getClubDetails = async (req, res) => {
    try {
        const clubId = req.club?._id;

        if (!clubId) {
            return res.status(401).json({ error: "Club not authenticated" });
        }

        const club = await Club.findById(clubId).select('-password -refreshToken -clubSecret').populate('applications pastEvents upcomingEvents');

        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }

        res.status(200).json(club);
    } catch (error) {
        console.error('Error retrieving club details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getClubsRecruiting = async (req, res) => {
    try {
        const clubs = await Club.find({ recruiting: true }).populate('applicationForm')
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const toggleRecruiting = async (req, res) => {
    try {
        const clubId = req.club?._id

        if (!clubId) {
            return res.status(401).json({ error: "Club not authenticated" })
        }
        
        const club = await Club.findById(clubId)

        club.recruiting = !club.recruiting
        await club.save()

        res.status(200).json({ recruiting: club.recruiting })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}