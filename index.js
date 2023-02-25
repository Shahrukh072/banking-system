const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const PORT = process.env.PORT || 8000;
const morgan = require('morgan');
const db = require('./config/mongoose');

// Middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.get('/', function (req, res) {
    res.json({
        "body": "banking system"
    });
});

// Routes
const customerRoutes = require('./routes/customers');
const accountRoutes = require('./routes/accounts');
const loanRoutes = require('./routes/loans');

app.use('/customers', customerRoutes);
app.use('/accounts', accountRoutes);
app.use('/loans', loanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
