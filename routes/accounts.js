const express = require('express');
const router = express.Router();
const Account = require('../model/account');

// Create a new account
router.post('/accounts', async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all accounts
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific account by id
router.get('/accounts/:id', getAccount, (req, res) => {
  res.json(res.account);
});

// Update an existing account
router.patch('/accounts/:id', getAccount, async (req, res) => {
  if (req.body.accountNumber != null) {
    res.account.accountNumber = req.body.accountNumber;
  }
  if (req.body.accountType != null) {
    res.account.accountType = req.body.accountType;
  }
  if (req.body.balance != null) {
    res.account.balance = req.body.balance;
  }
  try {
    const updatedAccount = await res.account.save();
    res.json(updatedAccount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an account
router.delete('/accounts/:id', getAccount, async (req, res) => {
  try {
    await res.account.remove();
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get an account by id
async function getAccount(req, res, next) {
  let account;
  try {
    account = await Account.findById(req.params.id);
    if (account == null) {
      return res.status(404).json({ message: 'Account not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.account = account;
  next();
}

module.exports = router;
