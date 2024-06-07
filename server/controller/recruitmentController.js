import Recruitment from "../model/recruitment.js";
import Club from "../model/club.js";

export const createRecruitment = async (req, res) => {
    try {
        const { clubId, applicationDeadline, applicationDetail } = req.body;

        if (!clubId) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }

        const recruitment = new Recruitment({
            club: clubId,
            applicationDeadline,
            applicationDetail,
        });

        const savedRecruitment = await recruitment.save();

        club.recruitment.push(savedRecruitment._id);
        await club.save();

        res.status(201).json(savedRecruitment);
    } catch (error) {
        console.error("Error creating recruitment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};