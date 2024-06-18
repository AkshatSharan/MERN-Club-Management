import Registration from '../model/registration.js';

export const createRegistration = async (req, res) => {
    const { eventId, formId, responses } = req.body;
    const { studentId } = req.user;

    try {
        const registration = new Registration({
            event: eventId,
            formData: formId,
            student: studentId,
            responses: responses,
        });

        await registration.save();

        res.status(201).json({ message: 'Registration submitted successfully', registration });
    } catch (error) {
        console.error('Error creating registration:', error);
        res.status(500).json({ error: 'Error creating registration' });
    }
};