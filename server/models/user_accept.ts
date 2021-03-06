import * as mongoose from 'mongoose';

var reqJoinSchema = new mongoose.Schema({
    from_email: { type: String, trim: true },    
    to_email: { type: String, trim: true },
    accept: { type: Number, default: 0 },
    role: { type: String , default : ""},        
    flag: { type: Number, default: 0 },    
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    create_date : Date,
    modify_date: Date
});
var mongoosePaginate = require('mongoose-paginate');
reqJoinSchema.plugin(mongoosePaginate);
var user_accept = mongoose.model('user_accept', reqJoinSchema);
export default user_accept;