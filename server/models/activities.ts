import * as mongoose from 'mongoose';

var activitiesSchema = new mongoose.Schema({
    activity_name: { type: String, uppercase: true, trim: true },
    pid: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    create_date: Date,
    modify_date: Date
});

const activities = mongoose.model('activities', activitiesSchema);
export default activities;