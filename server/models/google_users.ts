import * as mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
    user_id: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true }
});

const google_users = mongoose.model('google_users', userSchema);
export default google_users;