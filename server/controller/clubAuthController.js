import Club from "../model/club.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import refreshTokens from "../middlewares/refreshToken.js";

const generateAccessAndRefreshToken = (userId) => {
    const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const refreshTokenForClub = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
        const club = await Club.findOne({ refreshToken });
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        await refreshTokens(Club, refreshToken, res); // Ensure this function is correctly implemented
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ message: 'Token refresh failed' });
    }
};

export const signup = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

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
        const user = await Club.findOne({ clubEmail: email });

        if (!user) {
            return res.status(404).json({ error: "No club found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        };

        const sendUser = await Club.findOne({ clubEmail: email }).select("-password -refreshToken");

        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json({ user: sendUser, accessToken, refreshToken });
    } catch (error) {
        console.error('Error during signin: ', error);
        res.status(500).json({ error: "An error occurred during signin" })
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