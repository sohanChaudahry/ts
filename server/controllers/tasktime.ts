import Tasks from '../models/tasks';
import tasktime from '../models/tasktime';


var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
var empmodel = mongoose.model('employees');
//var TaskTime = mongoose.model('tasktime');
var projectsmodel = mongoose.model('projects');
var activities = mongoose.model('activities');

export default class TaskTimeCtrl  {
    model = tasktime
}