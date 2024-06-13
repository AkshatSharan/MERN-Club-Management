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
    if (req.user.id !== req.params.id) {
        return res.status(401).json("You can only update your account!")
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
            }
        }, { new: true })

        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({ error: "error" })
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