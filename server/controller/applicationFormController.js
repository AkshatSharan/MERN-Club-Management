import ApplicationForm from "../model/applicationform.js";
import Club from "../model/club.js";
import Application from "../model/application.js";
import mongoose from "mongoose";
import User from "../model/user.js";

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
        const clubId = req.params.clubId;
        const applicationForm = await ApplicationForm.findOne({ club: clubId }).populate('club');
        if (!applicationForm) {
            return res.status(404).json({ message: 'Application form not found for this club' });
        }
        res.status(200).json(applicationForm);
    } catch (error) {
        console.error('Error fetching application form:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

export const getApplicationFormAdmin = async (req, res) => {
    try {
        const { clubId } = req.params;
        const forms = await ApplicationForm.find({ club: clubId });

        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching form data', error });
    }
}

export const submitApplication = async (req, res) => {
    const { clubId, responses } = req.body;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newApplication = new Application({
            student: userId,
            club: clubId,
            responses: responses
        });

        await newApplication.save({ session });

        await User.findByIdAndUpdate(userId, { $push: { applications: newApplication._id } }, { session });

        await Club.findByIdAndUpdate(clubId, { $push: { applications: newApplication._id } }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Application created successfully', application: newApplication });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating application:', error);
        res.status(500).json({ message: 'Error creating application', error });
    }
}

export const alreadyApplied = async (req, res) => {
    try {
        const userId = req.user._id;
        const { clubId } = req.params;

        const existingApplication = await Application.findOne({ student: userId, club: clubId });

        if (existingApplication) {
            return res.json({ alreadyApplied: true });
        } else {
            return res.json({ alreadyApplied: false });
        }
    } catch (error) {
        console.error('Error checking application:', error);
        res.status(500).send('Server Error');
    }
}