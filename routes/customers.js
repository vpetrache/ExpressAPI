"use strict";

const express = require("express"),
  router = express.Router();
const auth = require("../midddleware/authorization");
let {
  Customer,
  validateUserInput,
  validateUserUpdateInput
} = require("../models/customers");

router.get("/", auth, async (req, res) => {
    const result = await Customer.find({})
      .sort({ name: 1 })
      .select({ name: 1, isGold: 1, phone: 1 });
    return res.send(result);
});

router.get("/:id", auth, async (req, res) => {
    const result = await Customer.findById(req.params.id).select({
      name: 1,
      isGold: 1,
      phone: 1
    });
    return res.send(result);
});

router.post("/", auth, async (req, res) => {
    let { error } = validateUserInput(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let customer = new Customer(req.body);
    const result = await customer.save();
    res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  //Update first
    const { error } = validateUserUpdateInput(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const result = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    return res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
    const result = await Customer.findByIdAndRemove(req.params.id);
    res.send(result);
});

module.exports = router;
