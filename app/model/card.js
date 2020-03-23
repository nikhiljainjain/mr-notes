let mongoose = require("mongoose");
//let shortid = require('shortid');

let njcard = new mongoose.Schema({
	//unique id generator
	uid: { type: String, default: null },
	//description
	desc: { type: String, default: null },
	//archive status
	archive: { type: Boolean, default: false },
	//reminder date
	dueDate: { type: Date, default: null },
	//attachement
	media: { type: String, default: null },
	//creator
	creator: { type: mongoose.Schema.ObjectId, ref: "njnotesusers" },
	//last login time
    creationTime: { type: Date, default: Date.now },
});

//njcard.pre(['create', 'save'], (next)=>{
//	this.uid = shortid.generate();
//});

module.exports = mongoose.model('njnotescards', njcard);