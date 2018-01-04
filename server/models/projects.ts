import * as mongoose from 'mongoose';

var projectSchema = new mongoose.Schema({
    project_name: { type: String, uppercase: true, trim: true },
    desc: { type: String , default : ""},    
    create_date: Date,
    modify_date: Date
});
var mongoosePaginate = require('mongoose-paginate');
projectSchema.plugin(mongoosePaginate);
var projects = mongoose.model('projects', projectSchema);
export default projects;