import * as mongoose from 'mongoose';

var taskSchema = new mongoose.Schema({
    assign_from: String,
    assign_to: String,
    task_title: { type: String, uppercase: true, trim: true ,default : ""},
    task_description: { type: String, trim: true,default: "" },    
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    activity_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' },
    select: { type: Number, default: 0 },
    due_date : Date,
    estimate_hrs : Number,
    actual_hrs :{ type: Number, default: 0 },
    priority : String,
    status : Number,
    start_date_time: Date,
    end_date_time: Date
});
var tasks = mongoose.model('tasks', taskSchema);
export default tasks;