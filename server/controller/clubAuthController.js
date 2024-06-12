import Club from "../model/club.js"
import bcryptjs from 'bcryptjs'

export const signup = async (req, res) => {
    try {
        const hashedPassword = bcryptjs.hashSync(req.body.password, 10);

        const clubData = new Club({
            ...req.body,
            password: hashedPassword
        });

        if (!clubData) {
            return res.status(404).json({ msg: "data not found" })
        }

        const savedClub = await clubData.save()
        res.status(200).json(savedClub)

    } catch (error) {
        res.status(500).json({ error: "error" })
    }
}