let mongoose = require("mongoose");

let njcard = new mongoose.Schema({
	//unique id generator
	uid: { 
		type: String, 
		default: null
	},
	//description
	desc: { 
		type: String, 
		default: null 
	},
	//archive status
	archive: { 
		type: Boolean, 
		default: false 
	},
	//reminder date
	dueDate: { 
		type: Date, 
		default: null 
	},
	//creator
	creater: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesusers",
		select: false 
	},
	//last login time
    creationTime: { 
		type: Date, 
		default: Date.now,
		select: false 
	},
	//ip address
	registerIP: {
		type: String,
		default: null,
		select: false
	}
});

module.exports = mongoose.model('njnotescards', njcard);