import jwt from 'jsonwebtoken';

const refreshTokens = async (model, refreshToken, res) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await model.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Token verification error: ', error);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

export default refreshTokens;