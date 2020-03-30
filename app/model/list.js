let mongoose = require("mongoose");

let njlist = new mongoose.Schema({
	//notes uid
	notesUid: { type: String, default: null },
	//unique id generator
	uid: { type: String, default: null },
	//board name
    name: { type: String, default: "Mr. X"},
	//creator
	creator: { type: mongoose.Schema.ObjectId, ref: "njnotesusers" },
	//assigned To
	assignTo: { type: mongoose.Schema.ObjectId, ref: "njnotesuers" },
	//creation time
    creationTime: { type: Date, default: Date.now },
	//notes id
	cards: [ { 
		type: mongoose.Schema.ObjectId, 
		ref: 'njnotescards'
	} ]
});

module.exports = mongoose.model('njnoteslists', njlist);