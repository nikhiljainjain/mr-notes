const mongoose = require('mongoose');
//database url picker
const DB_URI = (process.env.NODE_ENV === 'PRODUCTION') ? process.env.MONGODB_URL : process.env.TESTDB_URL;
const DB_PARA = { 
    useUnifiedTopology: true,  
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true 
};

function connect() {
    // console.log(DB_URI);
    // return new Promise((resolve, reject) => {
    //     if (process.env.NODE_ENV === 'test') {
    //         const Mockgoose = require('mockgoose').Mockgoose;
    //         const mockgoose = new Mockgoose(mongoose);

    //         mockgoose.prepareStorage()
    //         .then(() => {
    //             mongoose.connect(DB_URI || "mongodb://localhost:27017/test", DB_PARA, err => {
    //                 if (err) console.error.bind(console, 'connection error: ');
    //             });
    //         });
    //     } else {
            mongoose.connect(DB_URI || "mongodb://localhost:27017/test", DB_PARA, err => {
                if (err) console.error.bind(console, 'connection error: ');
            });
        //}
        console.log("Connected to Database");
    //});
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };