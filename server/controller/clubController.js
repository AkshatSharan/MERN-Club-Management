import Club from "../model/club.js";

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
};