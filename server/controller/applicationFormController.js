import ApplicationForm from "../model/applicationform.js";
import Club from "../model/club.js";

export const createApplicationForm = async (req, res) => {
    try {
        console.log('It runs')
        const { clubId } = req.params;
        const { formTitle, formDescription, questions } = req.body;
        
        if (req.club._id.toString() !== clubId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const newForm = new ApplicationForm({
            club: clubId,
            formTitle,
            formDescription,
            questions
        });
        
        await newForm.save();
        
        await Club.findByIdAndUpdate(clubId, {
            $push: { applicationForm: newForm._id }
        });
        
        res.status(201).json(newForm);
    } catch (error) {
        res.status(500).json({ message: 'Error creating form', error })
    }
}

export const updateApplicationForm = async (req, res) => {
    console.log('It also runs')
    try {
        const { formId } = req.params;
        const { formTitle, formDescription, questions } = req.body

        const form = await ApplicationForm.findById(formId)

        if (req.club._id.toString() !== form.club.toString()) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        const updatedForm = await ApplicationForm.findByIdAndUpdate(
            formId,
            { formTitle, formDescription, questions },
            { new: true }
        )

        res.status(200).json(updatedForm);
    } catch (error) {
        res.status(500).json({ message: 'Error updating form', error })
    }
}

export const getApplicationForm = async (req, res) => {
    try {
        const { clubId } = req.params;
        const forms = await ApplicationForm.find({ club: clubId });

        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching form data', error });
    }
}