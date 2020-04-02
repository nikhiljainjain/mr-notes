let mongoose = require("mongoose");

let njcard = new mongoose.Schema({
	//unique id generator
	uid: { type: String, default: null },
	//description
	desc: { type: String, default: null },
	//archive status
	archive: { type: Boolean, default: false },
	//reminder date
	dueDate: { type: Date, default: null },
	//creator
	creater: { type: mongoose.Schema.ObjectId, ref: "njnotesusers" },
	//last login time
    creationTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('njnotescards', njcard);