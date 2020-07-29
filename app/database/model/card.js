let mongoose = require("mongoose");

let njcard = new mongoose.Schema({
	//setting color for card
	color: {
		type: String,
		default: "purple",
		trim: true,
		lowercase: true
	},
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
	//ip address
	ipAddress: {
		type: String,
		default: null,
		select: false
	}
},{
    timestamps: true
});

module.exports = mongoose.model('njnotescards', njcard);