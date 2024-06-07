import user from "../model/user.js"

export const createUser = async (req, res) => {
    try {
        const userData = new user(req.body)

        if (!userData) {
            return res.status(404).json({ msg: "user data not found" })
        }

        const savedData = await userData.save()
        res.status(200).json(savedData)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const userData = await user.find()

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
        const userExist = await user.findOne({ email: id })

        if (!userExist) {
            return res.status(404).json({ msg: "user data not found" })
        }
        res.status(200).json(userExist)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.email
    const userExist = await user.findOne({ email: id })

    if (!userExist) {
        return res.status(401).json({ msg: "User data not found" })
    }
    const updatedData = await user.findOneAndUpdate({ email: id }, req.body, { new: true })
    res.status(200).json(updatedData)
}

export const deleteUser = async (req, res) => {
    const id = req.params.email
    const userExist = await user.findOne({ email: id })

    if (!userExist) {
        return res.status(404).json({ msg: "User data not found" })
    }
    await user.findOneAndDelete({ email: id })
    res.status(200).json({msg: "user deleted"})
}