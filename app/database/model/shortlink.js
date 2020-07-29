let mongoose = require("mongoose");

let shortLink = new mongoosese.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        require: true
    },
    shortId: {
        type: String,
        default: null,
        require: true,
        trim: true,
        unique: true
    },
    mappedUrl: {
        type: String,
        default: null,
        unique: true,
        trim: true,
        require: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model("shortlinks", shortLink);