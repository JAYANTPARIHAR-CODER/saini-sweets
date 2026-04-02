const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: "Name and message are required!" });
        }

        const contact = await Contact.create({ name, phone, message });
        res.status(201).json({ success: true, data: contact });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 }); // newest first
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createContact, getContacts };