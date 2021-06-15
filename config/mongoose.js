const mongoose = require('mongoose');
MONGODB_URL = "mongodb+srv://Admin-shubham:admin123@mybackendcluster.i2yc9.mongodb.net/bucketvio_developement?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", function (err) {
    if (err) {console.log(err);}
    console.log("Connected to database :)");
});



