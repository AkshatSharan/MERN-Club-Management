import Club from "../model/club.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const validClub = await Club.findOne({ clubEmail: email });
        if (!validClub) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const validPassword = bcryptjs.compareSync(password, validClub.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const { password: hashedPassword, ...rest } = validClub._doc;
        const token = jwt.sign({ id: validClub._id }, process.env.JWT_SECRET);
        const expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
    } catch (error) {
        console.error('Error during signin: ', error);
        res.status(500).json({ error: "An error occurred during signin" });
    }
}