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
    try {

        const id = req.params.email
        const userExist = await User.findOne({ email: id })

        if (!userExist) {
            return res.status(404).json({ msg: "user data not found" })
        }
        res.status(200).json(userExist)

    } catch (error) {
        res.status(500).json({ error: "error" })
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