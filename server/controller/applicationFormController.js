import ApplicationForm from "../model/applicationform.js";
import Club from "../model/club.js";
import Application from "../model/application.js";
import mongoose from "mongoose";
import User from "../model/user.js";

export const createApplicationForm = async (req, res) => {
    try {
        console.log('It runs')
        const { clubId } = req.params;
        const { formTitle, formDescription, questions, applicationDeadline } = req.body;

        if (req.club._id.toString() !== clubId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newForm = new ApplicationForm({
            club: clubId,
            formTitle,
            formDescription,
            questions, applicationDeadline
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
        const { formTitle, formDescription, questions, applicationDeadline } = req.body

        const form = await ApplicationForm.findById(formId)

        if (req.club._id.toString() !== form.club.toString()) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        const updatedForm = await ApplicationForm.findByIdAndUpdate(
            formId,
            { formTitle, formDescription, questions, applicationDeadline },
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


export const getApplications = async (req, res) => {
    try {
        const clubId = req.club._id;

        const club = await Club.findOne({ _id: clubId })
            .populate({
                path: 'applications',
                populate: {
                    path: 'student',
                    select: '-_id -password -refreshToken'
                }
            })
            .populate('applicationForm');

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const { clubName, applicationForm, applications } = club;

        res.status(200).json({ clubName, applicationForm, applications });
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ message: 'Error fetching form data', error });
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const changes = req.body;

        const updatePromises = Object.entries(changes).map(async ([applicationId, newStatus]) => {
            const application = await Application.findById(applicationId).populate('student').populate('club');
            if (!application) {
                throw new Error(`Application with ID ${applicationId} not found`);
            }

            const user = await User.findById(application.student._id);
            if (!user) {
                throw new Error(`User with ID ${application.student._id} not found`);
            }

            const club = await Club.findById(application.club._id);
            if (!club) {
                throw new Error(`Club with ID ${application.club._id} not found`);
            }

            // Update application status
            application.applicationStatus = newStatus;
            await application.save();

            // Add notification to user
            const notificationMessage = `Your application for ${club.clubName} has been ${newStatus}`;
            user.notifications.push(notificationMessage);
            await user.save();
        });

        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Application statuses updated successfully' });
    } catch (error) {
        console.error('Error updating application statuses:', error);
        res.status(500).json({ message: 'Error updating application statuses', error });
    }
};