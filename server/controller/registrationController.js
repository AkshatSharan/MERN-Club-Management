import mongoose from 'mongoose';
import Registration from '../model/registration.js';
import User from '../model/user.js';

export const createRegistration = async (req, res) => {
    const { eventId, formId } = req.params
    const { responses } = req.body
    const userId = req.user._id

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const registration = new Registration({
            event: eventId,
            formData: formId,
            student: userId,
            responses: responses,
        })

        await registration.save({ session })

        const user = await User.findById(userId).session(session)
        user.registrations.push(registration._id)
        await user.save({ session })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({ message: 'Registration created successfully', registration })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.error('Error creating registration:', error)
        res.status(500).json({ message: 'Error creating registration', error })
    }
}