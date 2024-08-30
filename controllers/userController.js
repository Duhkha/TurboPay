const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { name, email, password, ethAddress } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            ethAddress
        });

        await user.save();

        res.status(201).send('User registered');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
