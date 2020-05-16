const mongoose = require('mongoose');
//database url picker
const DB_PARA = { 
    useUnifiedTopology: true,  
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true 
};

function connect(production_env=false) {
    const DB_URI = production_env ? process.env.MONGODB_URL : process.env.TESTDB_URL;

    return mongoose.connect(DB_URI || "mongodb://localhost:27017/test", DB_PARA, err => {
        if (err) console.error.bind(console, 'connection error: ');
        console.log("Connected to Database");
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };