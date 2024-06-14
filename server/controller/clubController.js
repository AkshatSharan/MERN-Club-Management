import Club from "../model/club.js";
import jwt from 'jsonwebtoken'

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const club = await Club.findById(decoded._id);

        if (!club || club.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign({ _id: club._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ _id: club._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        club.refreshToken = newRefreshToken;
        await club.save({ validateBeforeSave: false });

        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

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
};