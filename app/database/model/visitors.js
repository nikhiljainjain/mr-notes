let mongoose = require("mongoose");

let njSharedLinkVisitors = new mongoose.Schema({
	//unique id generator
	notesUid: { 
		type: String, 
		default: null 
    },
    //ip address
    ipAddress: {
        type: String,
        default: null,
        require: true,
        trim: true
    },
    //unique user
    unique: {
        type: Boolean,
        default: true,
        required: true
    },
    //exsited user of mr notes
    existedUser: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    }

},
{
    timestamps: true
});

module.exports = mongoose.model('njsharedlinkvisitors', njSharedLinkVisitors);