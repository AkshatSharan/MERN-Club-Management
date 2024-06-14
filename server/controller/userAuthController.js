import User from "../model/user.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Something went wrong: ', error);
        throw new Error("Something went wrong");
    }
}

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
    const { collegeRegistration, password } = req.body;
    try {
        const user = await User.findOne({ collegeRegistration });
        if (!user) {
            return res.status(404).json({ error: "No registration found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict', // Adjust based on your requirements
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        };

        console.log('Setting accessToken cookie:', accessToken);
        console.log('Setting refreshToken cookie:', refreshToken);

        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json({ user: loggedInUser, accessToken, refreshToken });
    } catch (error) {
        console.error('Error during signin: ', error);
        res.status(500).json({ error: "An error occurred during signin" });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        const user = await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
        if (!user) {
            return res.status(400).json({ error: "User not found or already logged out" });
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error('Error during logout: ', error);
        res.status(500).json({ error: "An error occurred during logout" });
    }
};
