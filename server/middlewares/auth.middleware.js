import jwt from 'jsonwebtoken'
import Club from '../model/club.js'
import User from '../model/user.js'

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            res.status(401).json("Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            res.status(401).json("Invalid access token")
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ error: "Invalid access token" });
    }
}

export const verifyClub = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.log("No token provided");
            return res.status(401).json("Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken?._id) {
            console.log("Invalid token");
            return res.status(401).json("Invalid access token");
        }

        const club = await Club.findById(decodedToken._id).select("-password -refreshToken");

        if (!club) {
            console.log("No club found for the given token");
            return res.status(401).json("Invalid access token");
        }

        req.club = club;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: "Invalid access token" });
    }
};