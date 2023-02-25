const express = require('express');
const router = express.Router();
const Customer = require('../model/Customer');

// GET all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.send(customers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a single customer by ID
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// CREATE a new customer
router.post('/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// UPDATE a customer by ID
router.patch('/customers/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }

    updates.forEach((update) => (customer[update] = req.body[update]));
    await customer.save();

    res.send(customer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE a customer by ID
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
