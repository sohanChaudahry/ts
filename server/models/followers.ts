import * as mongoose from 'mongoose';

var followerSchema = new mongoose.Schema({
    email: { type: String, ref: 'employees' },
    project_id: { type: String , default : ""},
    create_date: Date,
    modify_date: Date
});

const followers = mongoose.model('followers', followerSchema);
export default followers;