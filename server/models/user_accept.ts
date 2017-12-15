import * as mongoose from 'mongoose';

var reqJoinSchema = new mongoose.Schema({
    from_email: { type: String, trim: true },    
    to_email: { type: String, trim: true },
    accept: { type: Number, default: 0 },
    flag: { type: Number, default: 0 },    
    project_id: { type: String, trim: true },
    create_date : Date,
    modify_date: Date
});
var user_accept = mongoose.model('user_accept', reqJoinSchema);
export default user_accept;