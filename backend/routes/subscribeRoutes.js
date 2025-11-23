const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber'); 

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }

    try {
        const exists = await Subscriber.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: 'Email already subscribed.' });
        }

        const subscriber = await Subscriber.create({ email });
        res.status(201).json({ success: true, message: 'Subscribed successfully!', data: subscriber });

    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ success: false, message: 'Server error during subscription.' });
    }
});

module.exports = router;