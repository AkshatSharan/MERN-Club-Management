import RegistrationForm from '../model/registrationform.js';
import UpcomingEvent from '../model/upcomingevent.js';

export const createRegistrationForm = async (req, res) => {
    const { eventId } = req.params;
    const { formTitle, questions, formDescription } = req.body;

    try {
        const event = await UpcomingEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const registrationForm = new RegistrationForm({
            event: eventId,
            formTitle,
            formDescription,
            questions,
        });

        await registrationForm.save();

        event.registrationForm.push(registrationForm._id);
        await event.save();

        res.status(201).json({ message: 'Registration form created successfully', registrationForm });
    } catch (error) {
        console.error('Error creating registration form:', error);
        res.status(500).json({ error: 'Error creating registration form' });
    }
}

export const getForm = async (req, res) => {
    try {
        const { eventId } = req.params;
        const form = await RegistrationForm.findOne({ event: eventId });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateForm = async (req, res) => {
    const { eventId } = req.params;
    const { formTitle, questions, formDescription } = req.body;

    try {
        const updatedForm = await RegistrationForm.findOneAndUpdate(
            { event: eventId },
            { formTitle, questions, formDescription },
            { new: true } // To return the updated document
        );

        if (!updatedForm) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.status(200).json({ message: 'Registration form updated successfully', updatedForm });
    } catch (error) {
        console.error('Error updating registration form:', error);
        res.status(500).json({ error: 'Error updating registration form' });
    }
};