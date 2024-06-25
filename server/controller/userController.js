import User from "../model/user.js"

export const getAllUser = async (req, res) => {
    try {
        const userData = await User.find()

        if (!userData) {
            return res.status(404).json({ msg: "user data not found" })
        }
        res.status(200).json(userData)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}

export const getSpecificUser = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)
            .populate({
                path: 'registrations',
                populate: {
                    path: 'event',
                    select: 'eventTitle eventStartDate',
                    populate: {
                        path: 'club',
                        select: 'clubLogo'
                    }
                }
            }).populate({
                path: 'applications',
                populate: {
                    path: 'club',
                }
            }).populate({
                path: 'followedClubs',
                select: '-password -refreshToken',
                select: 'clubLogo clubName recruiting upcomingEvents'
            })
            .select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user,
            accessToken: req.accessToken,
            refreshToken: req.refreshToken
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Error retrieving user profile', error });
    }
}

export const updateUser = async (req, res) => {
    const { fname, lname, email, phone } = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            fname,
            lname,
            phone,
            email,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'An error occurred while updating user' });
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.email
    const userExist = await User.findOne({ email: id })

    if (!userExist) {
        return res.status(404).json({ msg: "User data not found" })
    }
    await User.findOneAndDelete({ email: id })
    res.status(200).json({ msg: "user deleted" })
}

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId, 'notifications');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ notifications: user.notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { notificationText } = req.params;

        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { $pull: { notifications: notificationText } },
            { new: true }
        );

        res.status(200).json({ message: 'Notification deleted successfully', user });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Error deleting notification' });
    }
}

export const followClub = async (req, res) => {
    const { clubId } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user.followedClubs.includes(clubId)) {
            user.followedClubs.push(clubId);
            await user.save();
        }
        res.status(200).send({ message: 'Club followed' });
    } catch (error) {
        res.status(500).send({ error: 'Error following club' });
    }
}

export const unfollowClub = async (req, res) => {
    const { clubId } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        user.followedClubs = user.followedClubs.filter(id => id.toString() !== clubId);
        await user.save();
        res.status(200).send({ message: 'Club unfollowed' });
    } catch (error) {
        res.status(500).send({ error: 'Error unfollowing club' });
    }
}