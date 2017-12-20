import * as mongoose from 'mongoose';

var followerSchema = new mongoose.Schema({
    email: { type: String, ref: 'employees' },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    role: { type: String , default : ""},    
    ismanager:{ type: Number, default: 0 },
    create_date: Date,
    modify_date: Date
});

const followers = mongoose.model('followers', followerSchema);
export default followers;