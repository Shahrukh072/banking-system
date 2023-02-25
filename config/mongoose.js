const mongoose = require('mongoose');
//connect
mongoose.connect('mongodb://localhost:27017/banking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

//db connected
db.once('open', function () {
    console.log('Connected to Database');
});

//export db
module.exports = db;