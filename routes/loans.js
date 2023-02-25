const express = require('express');
const router = express.Router();
const Loan = require('../model/loan');
const Customer = require('../model/Customer');

// Get all loans
router.get('/loans', async (req, res) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a loan by ID
router.get('/loans/:id', getLoan, (req, res) => {
  res.json(res.loan);
});

// Create a new loan
router.post('/loans', async (req, res) => {
  try {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const loanAmount = req.body.loanAmount;
    const monthlyIncome = customer.monthlyIncome;
    const monthlyExpenses = customer.monthlyExpenses;
    const existingLoanEMI = customer.existingLoanEMI || 0;

    const totalMonthlyExpenses = monthlyExpenses + existingLoanEMI;
    const maxLoanAmount = (monthlyIncome * 0.36 - totalMonthlyExpenses).toFixed(2);
    if (loanAmount > maxLoanAmount) {
      return res.status(400).json({
        message: `Loan amount exceeds the maximum loan amount of ${maxLoanAmount}`,
      });
    }

    const loan = new Loan({
      customerId: req.body.customerId,
      loanAmount: req.body.loanAmount,
      interestRate: req.body.interestRate,
      loanTerm: req.body.loanTerm,
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a loan by ID
router.delete('/loans/:id', getLoan, async (req, res) => {
  try {
    await res.loan.remove();
    res.json({ message: 'Loan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a loan by ID
async function getLoan(req, res, next) {
  let loan;
  try {
    loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.loan = loan;
  next();
}

module.exports = router;
