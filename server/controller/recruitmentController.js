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

export const getCurrentlyRecruiting = async (req, res) => {
    try {
        const recruitments = await Recruitment.find({ accepting: true })
            .populate('club', 'clubName clubLogo applicationDeadline')
            .exec();

        res.status(200).json(recruitments);
    } catch (error) {
        console.error("Error fetching recruitments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const toggleRecruiting = async (req, res) => {
    try {
        const { id } = req.params;

        const recruitment = await Recruitment.findById(id);

        if (!recruitment) {
            return res.status(404).json({ error: 'Recruitment not found' });
        }

        recruitment.accepting = !recruitment.accepting;

        const updatedRecruitment = await recruitment.save();

        res.json(updatedRecruitment);
    } catch (error) {
        console.error('Error toggling recruitment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};