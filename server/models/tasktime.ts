import * as mongoose from 'mongoose';

var taskSchema = new mongoose.Schema({
    pid: { type: mongoose.Schema.Types.ObjectId},
    actual_hrs : Number,
    comment : String,
    start_date_time: Date,
    end_date_time: Date
});
var tasktime = mongoose.model('tasktime', taskSchema);
export default tasktime;