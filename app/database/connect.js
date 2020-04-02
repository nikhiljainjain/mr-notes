const mongoose = require('mongoose');
//database url picker
const DB_URI = (process.env.NODE_ENV === 'production') ? process.env.MONGODB_URL : process.env.TESTDB_URL;

function connect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
            .then(() => {
                mongoose.connect(DB_URI,
                    { useUnifiedTopology: true,  useNewUrlParser: true, useFindAndModify: false })
                    .then((res, err) => {
                        if (err) return reject(err);
                        resolve();
                });
            });
        } else {
            mongoose.connect(DB_URI,
                { useUnifiedTopology: true,  useNewUrlParser: true, useFindAndModify: false })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
            })
        }
        console.log("Connected to Database");
    });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };