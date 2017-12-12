import Tasks from '../models/tasks';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
export default class TasksCtrl  {

  model = Tasks;

  /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : save_update_Tasks
  @desc :Save and update task details and select task.
  */
  save_update_Tasks = (req, res) => {
    var tasks = req.body.reqData;
    const current_date = new Date();
    //console.log(current_date);    
    //current_date.setDate(Number(current_date.getDate()) + 60);
   // console.log(current_date);
    var model = this.model;
    var count = 0;
    var dt = {
        success: ""
    };
    var successData = {
        successData : []
    }
    var failedData = {
        failedData : []
    }
    var length = tasks.length ? tasks.length : 0;
    async.forEach(tasks, function (task, callback) {
        if(task && task._id != "" && task._id != null && task._id != undefined){
          //If Task is already exist
        var _idstatus = mongoose.Types.ObjectId.isValid(task._id);
        if (_idstatus == false) {
               count = length;
              var err = task._id + ' Task Id is invalid';    
              task.error = err;           
              failedData.failedData.push(task);
              callback();
        }
        var task_id = mongoose.Types.ObjectId(task._id);
        model.find({ "_id": task_id }, function (err, data) {
              if(data && data.length > 0){
                    model.findOneAndUpdate({ "_id": task_id}, { "$set": 
                    { "assign_from":task.assign_from  ? task.assign_from : data[0]._doc.assign_from ,
                    "assign_to":task.assign_to ? task.assign_to : data[0]._doc.assign_to ,
                    "task_title": task.task_title ? task.task_title : data[0]._doc.task_title,
                    "task_description": task.task_description ? task.task_description : data[0]._doc.task_description,                    
                    "project_id": task.project_id ? task.project_id : data[0]._doc.project_id,
                     "activity_id": task.activity_id ? task.activity_id : data[0]._doc.activity_id,
                     "due_date": task.due_date ? task.due_date : data[0]._doc.due_date,
                     "select": task.select ? task.select : data[0]._doc.select,
                     "estimate_hrs": task.estimate_hrs ? task.estimate_hrs : data[0]._doc.estimate_hrs,
                     "actual_hrs": task.actual_hrs ? task.actual_hrs : data[0]._doc.actual_hrs,
                     "role": task.role ? task.role : data[0]._doc.role,
                     "status": task.status ? task.status : data[0]._doc.status,
                     "start_date_time": task.start_date_time ? task.start_date_time : data[0]._doc.start_date_time,
                     "end_date_time":task.end_date_time ? task.end_date_time : data[0]._doc.end_date_time } }).exec(function (err, data3) {
                         if (err) {
                               count = length; 
                               task.error = err;                                       
                               failedData.failedData.push(task);
                               callback();
                         }
                         else {
                                dt.success = "true";
                                successData.successData.push(task);
                                callback();
                          }
                      });
              }
              else{
                    //If Task is new
                    var obj = new model();
                    obj.assign_from = task.assign_from;
                    obj.assign_to = task.assign_to;
                    obj.task_title = task.task_title,
                    obj.task_description = task.task_description ? task.task_description : "",                    
                    obj.project_id = task.project_id;
                    obj.activity_id = task.activity_id;
                    obj.due_date = task.due_date ? task.due_date : "";
                    obj.estimate_hrs = task.estimate_hrs ? task.estimate_hrs : 0;
                    obj.actual_hrs = task.actual_hrs ? task.actual_hrs : 0;
                    obj.role = task.role ? task.role : "" ;
                    obj.status = task.status ? task.status : 0;
                    obj.start_date = task.start_date ? task.start_date : "";
                    obj.end_date = task.end_date ? task.end_date : "";  
                    obj.start_date_time = task.start_date_time ? task.start_date_time : "";
                    obj.end_date_time = task.end_date_time ? task.end_date_time : "";  
                    obj.save(function (err) {
                     if (err) {
                       count = length;
                       task.error = err;    
                       failedData.failedData.push(task);
                       callback();
                     }
                     else {
                        dt.success = "true";
                        successData.successData.push(task);
                        callback();
                     }
                   });
                 }
  
            })
         }
         else{
               //If Task is new
                var obj = new model();
                obj.assign_from = task.assign_from;
                obj.assign_to = task.assign_to;
                obj.task_title = task.task_title,
                obj.task_description = task.task_description ? task.task_description : "",                    
                obj.project_id = task.project_id;
                obj.activity_id = task.activity_id;
                obj.due_date = task.due_date ? task.due_date : "";
                obj.estimate_hrs = task.estimate_hrs ? task.estimate_hrs : 0;
                obj.actual_hrs = task.actual_hrs ? task.actual_hrs : 0;
                obj.role = task.role ? task.role : "" ;
                obj.status = task.status ? task.status : 0;
                obj.start_date_time = task.start_date_time ? task.start_date_time : "";
                obj.end_date_time = task.end_date_time ? task.end_date_time : ""; 
                obj.save(function (err) {
                if (err) {
                    count = length;
                    task.error = err;    
                    failedData.failedData.push(task);
                    callback();
                 }
                else {
                    dt.success = "true";
                    successData.successData.push(task);
                    callback();
                 }
                });
         }
  
      count = count + 1;
  
    }, function (err, cb) {
        var result = {};
        result['success'] = successData;
        result['failed'] = failedData;
          if(count >= length){
            res.send(result);
          }  
        return;
    });
  };

/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : getTaskDetails
  @desc :Get Task details by Id.
  */
  getTaskDetails = (req, res) => {   
    const current_date = new Date();
     var taskid = req.params.id;
     var model = this.model;
     var resdata = {
     };
     var _idstatus = mongoose.Types.ObjectId.isValid(taskid);
    if (_idstatus == false) {
        var resData = {};
        var err = taskid + 'Task Id is invalid';
        resData['error'] = err;
        res.send(resData);
    }
    else{
       var task_id = mongoose.Types.ObjectId(taskid);
       model.find({ "_id": task_id }, function (err, data) {
            if(data && data.length > 0){
               resdata = data[0]._doc;
               res.send(resdata);
            }
            else{
                 res.send(resdata);
            }       
       })
    }
 }


 




}