import User from "../model/user.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    try {
        const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
        const userData = new User({
            ...req.body,
            password: hashedPassword
        });

        if (!userData) {
            return res.status(400).json({ error: "All fields not entered" });
        }

        const savedUser = await userData.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            let errorMessage = "Duplicate key error";

            switch (duplicateField) {
                case 'phone':
                    errorMessage = "Phone number already in use";
                    break;
                case 'email':
                    errorMessage = "Email already in use";
                    break;
                case 'collegeRegistration':
                    errorMessage = "College registration number already in use";
                    break;
                default:
                    errorMessage = "An error occurred";
            }

            return res.status(400).json({ error: errorMessage });
        }
        res.status(500).json({ error: "An error occurred during signup" });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        const validUser = await User.findOne({email})
        if (!validUser) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const { password: hashedPassword, ...rest} = validUser._doc
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest)
    } catch (error) {

    }
}