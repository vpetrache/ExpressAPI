const express = require('express'),
    router = express.Router();
let { Customer,
    validateUserInput,
    validateUserUpdateInput } = require('../models/customers');
dbDebugger = require('debug')('app:db');

router.get('/', async (req, res) => {
    try {
        const result = await Customer.find({})
            .sort({ name: 1 })
            .select({ name: 1, isGold: 1, phone: 1 });
        return res.send(result);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await Customer.findById(req.params.id)
            .select({ name: 1, isGold: 1, phone: 1 });
        return res.send(result);
    }
    catch (err) {
        return res.status(404).send(
            `Customer with id ${req.params.id} wad not found!`
        )
    }
});

router.post('/', async (req, res) => {
    try {
        let { error } = validateUserInput(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        let customer = new Customer(req.body);
        const result = await customer.save();
        res.send(result);
    }
    catch (err) {
        return res.status(400).send(
            `Customer could not be created because: ${err}`
        )
    }
});

router.put('/:id', async (req, res) => {
    //Update first
    try {
        const { error } = validateUserUpdateInput(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const result = await Customer.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        return res.send(result);
    }
    catch (err) {
        return res.status(400).send(
            `Customer could not be updated because: ${err}`
        )
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Customer.findByIdAndRemove(req.params.id);
        res.send(result);
    }
    catch (err) {
        return res.status(400).send(
            `Customer could not be deleted because: ${err}`
        )
    }
});

module.exports = router;