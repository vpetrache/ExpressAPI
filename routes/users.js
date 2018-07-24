const express = require('express'),
    router = express.Router(),
    {User, validateNewUser} = require('../models/users');

router.post('/', async function (req, res) {
    try {
        let {error} = validateNewUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).send('User already exists!');
        }

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        return res.send(user);

    }
    catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;