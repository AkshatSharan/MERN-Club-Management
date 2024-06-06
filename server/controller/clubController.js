import club from "../model/club.js";

export const createClub = async (req, res) => {
    try {
        const clubData = new club(req.body)

        if (!clubData) {
            return res.status(404).json({ msg: "data not found" })
        }

        const savedClub = await clubData.save()
        res.status(200).json(savedClub)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}

export const getAllClubs = async (req, res) => {
    try {
        const clubData = await club.find()

        if (!clubData) {
            return res.status(404).json({ msg: "user data not found" })
        }

        res.status(200).json(clubData)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}