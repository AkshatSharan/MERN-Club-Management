import Club from "../model/club.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async function (clubSecret) {
    try {
        const user = await Club.findOne({clubSecret});
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
    const { clubEmail, password } = req.body;
    try {
        const user = await Club.findOne({ clubEmail });
        if (!user) {
            return res.status(404).json({ error: "No club found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.clubSecret);

        const loggedInUser = await Club.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        }

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
}

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        const user = await Club.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
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