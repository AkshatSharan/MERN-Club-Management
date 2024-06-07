import club from "../model/club.js";
import recruitment from "../model/recruitment.js";

export const createRecruitment = async (req, res) => {
    try {
        const recruitmentData = new recruitment(req.body);

        if (!recruitmentData) {
            return res.status(404).json({ msg: "Recruitment data not found" });
        }

        const savedRecruitment = await recruitmentData.save();

        const clubId = req.body.clubId;

        await club.findByIdAndUpdate(
            clubId,
            { $push: { recruitment: savedRecruitment._id } },
            { new: true }
        );

        res.status(200).json(savedRecruitment);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
