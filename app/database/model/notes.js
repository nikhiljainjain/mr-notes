let mongoose = require("mongoose");

let njnotes = new mongoose.Schema({
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
	//description
	desc: { 
		type: String, 
		default: null 
	},
	//creator
	creater: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesusers",
		select: false 
	},
	//team notes true if this will created for team
	teamWork: { 
		type: Boolean, 
		default: false 
	},
	//other members
	members: [ 
		{ 
			//objectid of the user
			memberId:{
				type: mongoose.Schema.ObjectId, 
				ref: 'njnotesusers'
			},
			//when requesting user accept the request
			acceptTime:{
				type: Date,
				default: null
			},
			//creator requesting time for new user
			requestTime: {
				type: Date,
				default: (new Date())
			},
			//user have accepted or not request for notes
			acceptStatus: {
				type: Boolean,
				default: false
			}
		} 
	], 
	//last login time
    creationTime: { 
		type: Date, 
		default: Date.now 
	},
	//ip address
	registerIP: {
		type: String,
		default: null,
		select: false
	},
	//notes id
	lists: [ 
		{ 
			type: mongoose.Schema.ObjectId, 
			ref: 'njnoteslists' 
		} 
	],
	//view status or archive
	archive: {
		type: Boolean,
		default: false,
		select: false
	},
	//make this publicly available to all
	public: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('njnotes', njnotes);