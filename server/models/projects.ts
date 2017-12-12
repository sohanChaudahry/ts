import * as mongoose from 'mongoose';

var projectSchema = new mongoose.Schema({
    project_name: { type: String, uppercase: true, trim: true },
    create_date: Date,
    modify_date: Date
});
var projects = mongoose.model('projects', projectSchema);
export default projects;