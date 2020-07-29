let mongoose = require("mongoose");

let njlist = new mongoose.Schema({
	//setting color for list
	color: {
		type: String,
		default: "purple",
		trim: true,
		lowercase: true
	},
	//notes uid
	notesUid: { 
		type: String, 
		default: null,
		select: false 
	},
	//unique id generator
	uid: { 
		type: String, 
		default: null 
	},
	//board name
	name: { 
		type: String, 
		default: "Mr. X"
	},
	//archive 
	archive: { 
		type: Boolean, 
		default: false,
		select: false
	},
	//creator
	creater: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesusers",
		select: false 
	},
	//assigned To (useful in team board)
	assignTo: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesuers" 
	},
	//ip address
	ipAddress: {
		type: String,
		default: null,
		select: false
	},
	//notes id
	cards: [ { 
		type: mongoose.Schema.ObjectId, 
		ref: 'njnotescards'
	} ],
	//view status or archive
	archive: {
		type: Boolean,
		default: false,
		select: false
	}
},{
    timestamps: true
});

module.exports = mongoose.model('njnoteslists', njlist);