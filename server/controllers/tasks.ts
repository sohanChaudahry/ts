import Tasks from '../models/tasks';
import tasktime from '../models/tasktime';
import followers from '../models/followers';
import employees from '../models/employees';
import projects from '../models/projects';
import activities1 from '../models/activities';


var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
var empmodel = mongoose.model('employees');
//var TaskTime = mongoose.model('tasktime');
var projectsmodel = mongoose.model('projects');
var activities = mongoose.model('activities');

export default class TasksCtrl  {

  model = Tasks;
  TaskTime = tasktime;
  emp1= employees;
  pr = projects;
  act1 = activities1;



  /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : save_update_Tasks
  @desc :Save and update task details and select task.
  */
  save_update_Tasks = (req, res) => {
    var tasktime = this.TaskTime; 
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
    var me = this;
    async.forEach(tasks, function (task, callback) {
        if(task && task._id != "" && task._id != null && task._id != undefined){
          var spendtime  = task.spendtime;
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
                     "assign_date" : task.assign_date ? task.assign_date : data[0]._doc.assign_date,                
                     "select": task && (task.select == 0 || task.select == 1 || task.select == 2 )? task.select : 0,
                     "estimate_hrs": task.estimate_hrs ? task.estimate_hrs : data[0]._doc.estimate_hrs,
                     //"actual_hrs": task.actual_hrs ? task.actual_hrs : data[0]._doc.actual_hrs,
                     "priority": task.priority ? task.priority : data[0]._doc.priority,
                     "status": task.status ? task.status : data[0]._doc.status,
                     "start_date_time": task.start_date_time ? task.start_date_time : data[0]._doc.start_date_time,
                     "end_date_time":task.end_date_time ? task.end_date_time : data[0]._doc.end_date_time,
                      "modify_date" : current_date ,
                       "stime" : me.toTimestamp(current_date)} }).exec(function (err, data3) {
                         if (err) {
                               count = length; 
                               task.error = err;                                       
                               failedData.failedData.push(task);
                               callback();
                         }
                         else {
                              var project_id = mongoose.Types.ObjectId(task.project_id);
                              followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data11) {
                              //If spendtime is not null
                                 if(spendtime && spendtime.start_date_time != null && spendtime.start_date_time != "" && spendtime.start_date_time != undefined && spendtime.end_date_time != null && spendtime.end_date_time != "" && spendtime.end_date_time != undefined){
                                  var obj = new tasktime();
                                  obj.pid = task_id;
                                  obj.start_date_time = spendtime.start_date_time ? spendtime.start_date_time : "";
                                  obj.end_date_time = spendtime.end_date_time ? spendtime.end_date_time : "";  
                                  obj.actual_hrs = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                                  obj.comment = spendtime.comment ? spendtime.comment : "";                                  
                                  obj.save(function (err) {
                                    if (err) {
                                      task.error = err;    
                                      failedData.failedData.push(task);
                                      callback();
                                    }
                                    else {

                                      model.findOneAndUpdate({ "_id": task_id}, { "$set": { 
                                        "actual_hrs": spendtime.actual_hrs ? (parseFloat(data[0]._doc.actual_hrs) + parseFloat(spendtime.actual_hrs)) : data[0]._doc.actual_hrs } }).exec(function (err, data3) {
                                            if (err) {
                                                  task.error = err;                                       
                                                  failedData.failedData.push(task);
                                                  callback();
                                            }
                                            else {
                                              dt.success = "true";
                                              successData.successData.push(task);
                                              callback();
                                            }
                                          })
                                    }
                                  })
                                }
                                else{
                                  dt.success = "true";
                                  successData.successData.push(task);
                                  callback();
                                }
                              })
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
                    obj.assign_date = task.assign_date ? task.assign_date : "";                                    
                    obj.estimate_hrs = task.estimate_hrs ? task.estimate_hrs : 0;
               //     obj.actual_hrs = task.actual_hrs ? task.actual_hrs : 0;
                    obj.priority = task.priority ? task.priority : "" ;
                    obj.status = task.status ? task.status : 0;
                    obj.start_date_time = task.start_date_time ? task.start_date_time : "";
                    obj.end_date_time = task.end_date_time ? task.end_date_time : "";  
                    obj.create_date = current_date;
                    obj.modify_date = current_date; 
                    obj.stime = me.toTimestamp(current_date);   
                    var project_id = mongoose.Types.ObjectId(task.project_id);
                    followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data4) {
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

                  })
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
                obj.assign_date = task.assign_date ? task.assign_date : "";                
                obj.estimate_hrs = task.estimate_hrs ? task.estimate_hrs : 0;
              //  obj.actual_hrs = task.actual_hrs ? task.actual_hrs : 0;
                obj.priority = task.priority ? task.priority : "" ;
                obj.status = task.status ? task.status : 0;
                obj.start_date_time = task.start_date_time ? task.start_date_time : "";
                obj.end_date_time = task.end_date_time ? task.end_date_time : ""; 
                obj.create_date = current_date;
                obj.modify_date = current_date;   
                obj.stime = me.toTimestamp(current_date);   
                var project_id = mongoose.Types.ObjectId(task.project_id);
               followers.findOneAndUpdate({ "email": task.email,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data4) {
              // followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data4) {
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
              })
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

  save_update_Tasks1 = (req, res) => {
    var tasktime = this.TaskTime; 
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
    var me = this;
    async.forEach(tasks, function (task, callback) {
        if(task && task._id != "" && task._id != null && task._id != undefined){
          var spendtime  = task.spendtime;
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
                     "assign_date" : task.assign_date ? task.assign_date : data[0]._doc.assign_date,                
                     "select": task && (task.select == 0 || task.select == 1 || task.select == 2 )? task.select : 0,
                     "estimate_hrs": task.estimate_hrs ? task.estimate_hrs : data[0]._doc.estimate_hrs,
                     //"actual_hrs": task.actual_hrs ? task.actual_hrs : data[0]._doc.actual_hrs,
                     "priority": task.priority ? task.priority : data[0]._doc.priority,
                     "status": task.status ? task.status : data[0]._doc.status,
                     "start_date_time": task.start_date_time ? task.start_date_time : data[0]._doc.start_date_time,
                     "end_date_time":task.end_date_time ? task.end_date_time : data[0]._doc.end_date_time,
                      "modify_date" : current_date ,
                       "stime" : me.toTimestamp(current_date)} }).exec(function (err, data3) {
                         if (err) {
                               count = length; 
                               task.error = err;                                       
                               failedData.failedData.push(task);
                               callback();
                         }
                         else {
                              var project_id = mongoose.Types.ObjectId(task.project_id);
                              followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data11) {
                              //If spendtime is not null
                                 if(spendtime && spendtime.start_date_time != null && spendtime.start_date_time != "" && spendtime.start_date_time != undefined && spendtime.end_date_time != null && spendtime.end_date_time != "" && spendtime.end_date_time != undefined){
                                  var obj = new tasktime();
                                  obj.pid = task_id;
                                  obj.start_date_time = spendtime.start_date_time ? spendtime.start_date_time : "";
                                  obj.end_date_time = spendtime.end_date_time ? spendtime.end_date_time : "";  
                                  obj.actual_hrs = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                                  obj.comment = spendtime.comment ? spendtime.comment : "";                                                                    
                                  obj.save(function (err) {
                                    if (err) {
                                      task.error = err;    
                                      failedData.failedData.push(task);
                                      callback();
                                    }
                                    else {

                                      model.findOneAndUpdate({ "_id": task_id}, { "$set": { 
                                        "actual_hrs": spendtime.actual_hrs ? (parseFloat(data[0]._doc.actual_hrs) + parseFloat(spendtime.actual_hrs)) : data[0]._doc.actual_hrs } }).exec(function (err, data3) {
                                            if (err) {
                                                  task.error = err;                                       
                                                  failedData.failedData.push(task);
                                                  callback();
                                            }
                                            else {
                                              dt.success = "true";
                                              successData.successData.push(task);
                                              callback();
                                            }
                                          })
                                    }
                                  })
                                }
                                else{
                                  dt.success = "true";
                                  successData.successData.push(task);
                                  callback();
                                }
                              })
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
                    obj.assign_date = task.assign_date ? task.assign_date : "";                                    
                    obj.estimate_hrs = task.estimate_hrs ? task.estimate_hrs : 0;
               //     obj.actual_hrs = task.actual_hrs ? task.actual_hrs : 0;
                    obj.priority = task.priority ? task.priority : "" ;
                    obj.status = task.status ? task.status : 0;
                    obj.start_date_time = task.start_date_time ? task.start_date_time : "";
                    obj.end_date_time = task.end_date_time ? task.end_date_time : "";  
                    obj.create_date = current_date;
                    obj.modify_date = current_date; 
                    obj.stime = me.toTimestamp(current_date);   
                    var project_id = mongoose.Types.ObjectId(task.project_id);
                    followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data4) {
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

                  })
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
                obj.assign_date = task.assign_date ? task.assign_date : "";                
                obj.estimate_hrs = task.estimate_hrs ? task.estimate_hrs : 0;
              //  obj.actual_hrs = task.actual_hrs ? task.actual_hrs : 0;
                obj.priority = task.priority ? task.priority : "" ;
                obj.status = task.status ? task.status : 0;
                obj.start_date_time = task.start_date_time ? task.start_date_time : "";
                obj.end_date_time = task.end_date_time ? task.end_date_time : ""; 
                obj.create_date = current_date;
                obj.modify_date = current_date;   
                obj.stime = me.toTimestamp(current_date);   
                var project_id = mongoose.Types.ObjectId(task.project_id);
               followers.findOneAndUpdate({ "email": task.email,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data4) {
              // followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data4) {
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
              })
         }
  
      count = count + 1;
  
    }, function (err, cb) {
        var result = {};
        result['success'] = successData;
        result['failed'] = failedData;
          if(count >= length){
           // res.send(result);
           cb(null,result)
          }  
        return;
    });
  };


 toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
 }



/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : getTaskDetails
  @desc :Get Task details by Id.
  */
  getTaskDetails = (req, res) => {  
    var tasktime = this.TaskTime;     
    const current_date = new Date();
     var taskid = req.params.id;
     var model = this.model;
     var resdata = {
       spendtimes : []
      };
     var _idstatus = mongoose.Types.ObjectId.isValid(taskid);
    if (_idstatus == false) {
        var resData = {};
        var err = taskid + 'Task Id is invalid';
        resData['error'] = err;
        res.send(resData);
    }
    else{
      var spendtimes = {spendtimes: [] }
      var count = 0;
       var task_id = mongoose.Types.ObjectId(taskid);
       model.find({ "_id": task_id }, function (err, data) {
        tasktime.find({ "pid": task_id }, function (err, data1) {
            if(data && data.length > 0){
               var assignfrom = mongoose.Types.ObjectId(data[0]._doc.assign_from);        
               var assignto = mongoose.Types.ObjectId(data[0]._doc.assign_to);
               var act_id = mongoose.Types.ObjectId(data[0]._doc.activity_id);    
              empmodel.find({ "_id": assignfrom }, function (err, data4) {          
              empmodel.find({ "_id": assignto }, function (err, data1) {
              activities.find({ "_id": act_id }, function (err, data3) {
               async.forEach(data1, function (spendtime, callback) {
                var dt = {};                
                dt['start_date_time'] = spendtime.start_date_time;
                dt['end_date_time'] = spendtime.end_date_time;  
                dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                spendtimes.spendtimes.push(dt);
                count = count + 1;
                callback();
               }, function (err, cb) {
                  if(count >= data1.length){
                    data[0]._doc.assign_from = data4[0]._doc;    
                     if(Math.ceil(parseFloat(data[0]._doc.actual_hrs)) === data[0]._doc.actual_hrs){
                      data[0]._doc.actual_hrs = data[0]._doc.actual_hrs + " : 0 : 0 ";
                    }
                    else{
                     console.log("actual: " + data[0]._doc.actual_hrs)                          
                     var hours =  Math.floor(data[0]._doc.actual_hrs);
                     var temp = parseFloat(data[0]._doc.actual_hrs) - Math.floor(parseFloat(data[0]._doc.actual_hrs));
                     var minutes = parseInt(((temp *3600)/60).toString());
                     var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                     data[0]._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                     console.log("Converted: " + data[0]._doc.actual_hrs)                                
                   }          
                    data[0]._doc.assign_to = data1[0]._doc;
                    data[0]._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ; 
                    resdata = data[0]._doc; 
                    resdata['spendtimes'] = spendtimes.spendtimes;
                    res.send(resdata);                    
                  }  
                return;
                  });
                })
              })
            })
            }
            else{
                 res.send(resdata);
            }       
          })
       })
    }
 }


/*
  @author : Vaibhav Mali 
  @date : 13 Dec 2017
  @API : getTaskDetailsByAssignFrom
  @desc :Get Task details by Assign From (Assign task from me).
  */
 getTaskDetailsByAssignFrom = (req, res) => {   
  var model = this.model;
  var tasks = {};
  var tasktemp = {tasks:[]};
  var count = 0,count1 = 0 ;
  var reqData =  req.body.reqData;
  var assign_from = reqData.employee_id;
  var project_id = reqData.project_id;
  var page = reqData.page;
  var limit = reqData.limit;
  var resdata = { };
  var _idstatus = mongoose.Types.ObjectId.isValid(assign_from);
  var _idstatus1 = mongoose.Types.ObjectId.isValid(project_id);  
  if (_idstatus == false) {
    var resData = {};
    var err = assign_from + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else if (_idstatus1 == false) {
    var resData = {};
    var err = project_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else{
      var project_id1 = mongoose.Types.ObjectId(project_id);
      var assign_from = mongoose.Types.ObjectId(assign_from);
      model.paginate({"assign_from": assign_from,"project_id":project_id1}, { sort:{"due_date":-1},page: page, limit: limit }, function(err, data) {                
   //   model.find({"assign_from": assign_from,"project_id":project_id1}, function (err, data) {
      if(data && data.docs.length > 0){
       async.forEach(data.docs, function (task, callback) {
        var employee_id1 = mongoose.Types.ObjectId(task._doc.assign_from);        
        var employee_id = mongoose.Types.ObjectId(task._doc.assign_to);
        var act_id = mongoose.Types.ObjectId(task._doc.activity_id);    
        empmodel.find({ "_id": employee_id1 }, function (err, data4) {          
        empmodel.find({ "_id": employee_id }, function (err, data1) {
          projectsmodel.find({ "_id": project_id1 }, function (err, data2) {
            activities.find({ "_id": act_id }, function (err, data3) {
              var task_id = mongoose.Types.ObjectId(task._doc._id);
              var spendtimes = {spendtimes: [] }                
              tasktime.find({ "pid": task_id }, function (err, data6) {
                if(data && data.docs.length > 0){
                 //  resdata = data[0]._doc;
                   async.forEach(data6, function (spendtime, callback) {
                    var dt = {};                
                    dt['start_date_time'] = spendtime.start_date_time;
                    dt['end_date_time'] = spendtime.end_date_time;  
                    dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                    spendtimes.spendtimes.push(dt);
                    count1 = count1 + 1;
                    callback();
                   }, function (err, cb) {
                      if(count1 >= data6.length){
                        task._doc.assign_from = data4[0]._doc;  
                        if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
                          task._doc.actual_hrs = task._doc.actual_hrs.toString() + " : 0 : 0 ";
                        }
                        else{
                          console.log("actual: " + task._doc.actual_hrs)                          
                          var hours =  Math.floor(task._doc.actual_hrs);
                          var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
                          var minutes = parseInt(((temp *3600)/60).toString());
                          var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                          task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                          console.log("Converted: " + task._doc.actual_hrs)                                
                        }
                        task._doc.assign_to = data1[0]._doc;
                         task._doc.project_id = (data2.length > 0) ? data2[0]._doc : project_id1 ;
                        task._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ;;  
                        task._doc.spendtimes = spendtimes.spendtimes;              
                        tasktemp.tasks.push(task._doc);
                        count = count + 1;
                        callback();                    
                      }  
                    return;
                   });
                }
                else{
                   count = count + 1;
                   callback();
                }       
              })     
            })
          })
        })
       })
        }, function (err, cb) {
        if(count >= data.docs.length){
          /*tasktemp.tasks.sort(function(a,b){
            var c:any = new Date(a.due_date);
            var d:any = new Date(b.due_date);
            return c-d;
          })*/
          tasks['tasks'] = tasktemp.tasks;
          tasks['Pages'] = data.pages;
          tasks['Total'] = data.total;
          res.send(tasks);          
        }  
        return;
      });  
    } 
    else{
       tasks['tasks'] = tasktemp.tasks;
       tasks['Pages'] = data.pages;
       tasks['Total'] = data.total;
       res.send(tasks);
    }          
   });
 };
}
 
/*
  @author : Vaibhav Mali 
  @date : 13 Dec 2017
  @API : getTaskDetailsByAssignTo
  @desc :Get Task details by Assign To (Assign task to me).
  */
getTaskDetailsByAssignTo = (req, res) => {   
  var model = this.model;
  var tasks = {};
  var tasktemp = {tasks:[]};
  var count = 0 , count1 = 0;
  var reqData =  req.body.reqData;
  var assign_to = reqData.employee_id;
  var project_id = reqData.project_id;
  var page = reqData.page;
  var limit = reqData.limit;
  var resdata = { };
  var _idstatus = mongoose.Types.ObjectId.isValid(assign_to);
  var _idstatus1 = mongoose.Types.ObjectId.isValid(project_id);  
  if (_idstatus == false) {
    var resData = {};
    var err = assign_to + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else if (_idstatus1 == false) {
    var resData = {};
    var err = project_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else{
      var project_id1 = mongoose.Types.ObjectId(project_id);
      var assign_to = mongoose.Types.ObjectId(assign_to);
    model.paginate({"assign_to": assign_to,"project_id":project_id1}, { sort:{"due_date":-1},page: page, limit: limit }, function(err, data) {        
      if(data && data.docs.length > 0){
       async.forEach(data.docs, function (task, callback) {
        var employee_id1 = mongoose.Types.ObjectId(task._doc.assign_from);        
        var employee_id = mongoose.Types.ObjectId(task._doc.assign_to);
        var act_id = mongoose.Types.ObjectId(task._doc.activity_id);    
        empmodel.find({ "_id": employee_id1 }, function (err, data4) {          
        empmodel.find({ "_id": employee_id }, function (err, data1) {
          projectsmodel.find({ "_id": project_id1 }, function (err, data2) {
            activities.find({ "_id": act_id }, function (err, data3) {     
              var task_id = mongoose.Types.ObjectId(task._doc._id);
              var spendtimes = {spendtimes: [] }                
              tasktime.find({ "pid": task_id }, function (err, data6) {
                if(data && data.docs.length > 0){
                   //resdata = data[0]._doc;
                   async.forEach(data6, function (spendtime, callback) {
                    var dt = {};                
                    dt['start_date_time'] = spendtime.start_date_time;
                    dt['end_date_time'] = spendtime.end_date_time;  
                    dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                    spendtimes.spendtimes.push(dt);
                    count1 = count1 + 1;
                    callback();
                   }, function (err, cb) {
                      if(count1 >= data6.length){
                        task._doc.assign_from = data4[0]._doc;    
                        if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
                          task._doc.actual_hrs = task._doc.actual_hrs.toString() + ": 0 : 0 ";
                        }
                        else{
                         console.log("actual: " + task._doc.actual_hrs)                          
                         var hours =  Math.floor(task._doc.actual_hrs);
                         var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
                         var minutes = parseInt(((temp *3600)/60).toString());
                         var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                         task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                         console.log("Converted: " + task._doc.actual_hrs)                                
                        }          
                        task._doc.assign_to = data1[0]._doc;
                         task._doc.project_id = (data2.length > 0) ? data2[0]._doc : project_id1 ;
                        task._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ;;  
                        task._doc.spendtimes = spendtimes.spendtimes;              
                        tasktemp.tasks.push(task._doc);
                        count = count + 1;
                        callback();                    
                      }  
                    return;
                   });
                }
                else{
                   count = count + 1;
                   callback();
                }       
              })  
            })
          })
        })
       })
        }, function (err, cb) {
        if(count >= data.docs.length){
          /*tasktemp.tasks.sort(function(a,b){
            var c:any = new Date(a.due_date);
            var d:any = new Date(b.due_date);
            return c-d;
          })*/
          tasks['tasks'] = tasktemp.tasks;
          tasks['Pages'] = data.pages;
          tasks['Total'] = data.total;
          res.send(tasks);
        }  
        return;
      });  
    } 
    else{
      tasks['tasks'] = tasktemp.tasks;
      tasks['Pages'] = data.pages;
      tasks['Total'] = data.total;
      res.send(tasks);
    }          
   })
 };
}

/*
  @author : Vaibhav Mali 
  @date : 05 Jan 2018
  @API : getPendingTasks
  @desc :Get Pending Tasks with pagination.
  */
getPendingTasks = (req, res) => {   
  var model = this.model;  
  var tasks = {};  
  var pending = {tasks:[]};
  var count = 0 , count1 = 0;
  var reqData =  req.body.reqData;
  var flag = reqData.flag;
  var emp_id = mongoose.Types.ObjectId(reqData.employee_id);
  var project_id = reqData.project_id;
  var page = reqData.page;
  var limit = reqData.limit;
  var resdata = { };
  var _idstatus = mongoose.Types.ObjectId.isValid(emp_id);
  var _idstatus1 = mongoose.Types.ObjectId.isValid(project_id);  
  if (_idstatus == false) {
    var resData = {};
    var err = emp_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else if (_idstatus1 == false) {
    var resData = {};
    var err = project_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else{
    var project_id1 = mongoose.Types.ObjectId(project_id);    
    var query = {};
    if(flag == 0){
      query = {"assign_from": emp_id,"project_id":project_id1,"status":0,"assign_date":{$lte:new Date()}}
    }
    else{
      query = {"assign_to": emp_id,"project_id":project_id1,"status":0,"assign_date":{$lte:new Date()}}
    }
    model.paginate(query, {sort:{"due_date":-1}, page: page, limit: limit }, function(err, data) {
      //  model.find({"assign_to": assign_to,"project_id":project_id1}, function (err, data) {
        if(data && data.docs.length > 0){
         async.forEach(data.docs, function (task, callback) {
          var employee_id1 = mongoose.Types.ObjectId(task._doc.assign_from);        
          var employee_id = mongoose.Types.ObjectId(task._doc.assign_to);
          var act_id = mongoose.Types.ObjectId(task._doc.activity_id);    
          empmodel.find({ "_id": employee_id1 }, function (err, data4) {          
          empmodel.find({ "_id": employee_id }, function (err, data1) {
            projectsmodel.find({ "_id": project_id1 }, function (err, data2) {
              activities.find({ "_id": act_id }, function (err, data3) {     
                var task_id = mongoose.Types.ObjectId(task._doc._id);
                var spendtimes = {spendtimes: [] }                
                tasktime.find({ "pid": task_id }, function (err, data6) {
                  if(data && data.docs.length > 0){
                    // resdata = data[0]._doc;
                     async.forEach(data6, function (spendtime, callback) {
                      var dt = {};                
                      dt['start_date_time'] = spendtime.start_date_time;
                      dt['end_date_time'] = spendtime.end_date_time;  
                      dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                      spendtimes.spendtimes.push(dt);
                      count1 = count1 + 1;
                      callback();
                     }, function (err, cb) {
                        if(count1 >= data6.length){
                          task._doc.assign_from = data4[0]._doc;    
                          if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
                            task._doc.actual_hrs = task._doc.actual_hrs + " : 0 : 0 ";
                          }
                          else{
                           console.log("actual: " + task._doc.actual_hrs)                          
                           var hours =  Math.floor(task._doc.actual_hrs);
                           var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
                           var minutes = parseInt(((temp *3600)/60).toString());
                           var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                           task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                           console.log("Converted: " + task._doc.actual_hrs)                                
                          }          
                          task._doc.assign_to = data1[0]._doc;
                           task._doc.project_id = (data2.length > 0) ? data2[0]._doc : project_id1 ;
                          task._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ;;  
                          task._doc.spendtimes = spendtimes.spendtimes; 
                          task._doc.expire = (task._doc.due_date < new Date()) ? 1 : 0;
                          pending.tasks.push(task._doc);
                          count = count + 1;
                          callback();                    
                        }  
                     // return;
                     });
                  }
                  else{
                     count = count + 1;
                     callback();
                  }       
                })  
              })
            })
          })
         })
          }, function (err, cb) {
             if(count >= data.docs.length){
        /*      if(pending && pending.tasks.length > 0){
              pending.tasks.sort(function(a,b){
              var c:any = new Date(a.due_date);
              var d:any = new Date(b.due_date);
              return c-d;
              });
              }*/
               tasks['Pending'] = pending.tasks;
               tasks["Pages"] = data.pages;
               tasks["Total"] = data.total;
              res.send(tasks);
              }  
              return;
          });  
        } 
        else{
          tasks['Pending'] = pending.tasks;
          tasks["Pages"] = data.pages;
          tasks["Total"] = data.total;
          res.send(tasks);
          return;
         }          
       })
  }
  
}

/*
  @author : Vaibhav Mali 
  @date : 05 Jan 2018
  @API : getCompletedTasks
  @desc :Get Completed Tasks with pagination.
  */
getCompletedTasks = (req, res) => {   
  var model = this.model;  
  var tasks = {};  
  var completed = {tasks:[]};
  var count = 0 , count1 = 0;
  var reqData =  req.body.reqData;
  var flag = reqData.flag;
  var project_id = reqData.project_id;
  var emp_id = mongoose.Types.ObjectId(reqData.employee_id);
  var page = reqData.page;
  var limit = reqData.limit;
  var resdata = { };
  var _idstatus = mongoose.Types.ObjectId.isValid(emp_id);
  var _idstatus1 = mongoose.Types.ObjectId.isValid(project_id);  
  if (_idstatus == false) {
    var resData = {};
    var err = emp_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else if (_idstatus1 == false) {
    var resData = {};
    var err = project_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else{
    var project_id1 = mongoose.Types.ObjectId(project_id);    
    var query = {};
    if(flag == 0){
      query = {"assign_from": emp_id,"project_id":project_id1,"status":2}
    }
    else{
      query = {"assign_to": emp_id,"project_id":project_id1,"status":2}
    }
    model.paginate(query, {sort:{"due_date":-1}, page: page, limit: limit }, function(err, data) {
      //  model.find({"assign_to": assign_to,"project_id":project_id1}, function (err, data) {
        if(data && data.docs.length > 0){
         async.forEach(data.docs, function (task, callback) {
          var employee_id1 = mongoose.Types.ObjectId(task._doc.assign_from);        
          var employee_id = mongoose.Types.ObjectId(task._doc.assign_to);
          var act_id = mongoose.Types.ObjectId(task._doc.activity_id);    
          empmodel.find({ "_id": employee_id1 }, function (err, data4) {          
          empmodel.find({ "_id": employee_id }, function (err, data1) {
            projectsmodel.find({ "_id": project_id1 }, function (err, data2) {
              activities.find({ "_id": act_id }, function (err, data3) {     
                var task_id = mongoose.Types.ObjectId(task._doc._id);
                var spendtimes = {spendtimes: [] }                
                tasktime.find({ "pid": task_id }, function (err, data6) {
                  if(data && data.docs.length > 0){
                    // resdata = data[0]._doc;
                     async.forEach(data6, function (spendtime, callback) {
                      var dt = {};                
                      dt['start_date_time'] = spendtime.start_date_time;
                      dt['end_date_time'] = spendtime.end_date_time;  
                      dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                      spendtimes.spendtimes.push(dt);
                      count1 = count1 + 1;
                      callback();
                     }, function (err, cb) {
                        if(count1 >= data6.length){
                          task._doc.assign_from = data4[0]._doc;    
                          if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
                            task._doc.actual_hrs = task._doc.actual_hrs + " : 0 : 0 ";
                          }
                          else{
                           console.log("actual: " + task._doc.actual_hrs)                          
                           var hours =  Math.floor(task._doc.actual_hrs);
                           var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
                           var minutes = parseInt(((temp *3600)/60).toString());
                           var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                           task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                           console.log("Converted: " + task._doc.actual_hrs)                                
                          }          
                          task._doc.assign_to = data1[0]._doc;
                           task._doc.project_id = (data2.length > 0) ? data2[0]._doc : project_id1 ;
                          task._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ;;  
                          task._doc.spendtimes = spendtimes.spendtimes;    
                          completed.tasks.push(task._doc);
                            count = count + 1;
                          callback();                    
                        }  
                     // return;
                     });
                  }
                  else{
                     count = count + 1;
                     callback();
                  }       
                })  
              })
            })
          })
         })
          }, function (err, cb) {
             if(count >= data.docs.length){
              /*if(completed && completed.tasks.length > 0){
                completed.tasks.sort(function(a,b){
              var c:any = new Date(a.due_date);
              var d:any = new Date(b.due_date);
              return c-d;
              });
              }*/
               tasks['Completed'] = completed.tasks;
               tasks["Pages"] = data.pages;
               tasks["Total"] = data.total;
              res.send(tasks);
              }  
              return;
          });  
        } 
        else{
          tasks['Completed'] = completed.tasks;
          tasks["Pages"] = data.pages;
          tasks["Total"] = data.total;
          res.send(tasks);
          return;
         }          
       })
  }
  
}

/*
  @author : Vaibhav Mali 
  @date : 05 Jan 2018
  @API : getIn_ProgressTasks
  @desc :Get In_Progress Tasks with pagination.
  */
getIn_ProgressTasks = (req, res) => {   
  var model = this.model;  
  var tasks = {};  
  var in_progress = {tasks:[]};
  var count = 0 , count1 = 0;
  var reqData =  req.body.reqData;
  var flag = reqData.flag;
  var emp_id = mongoose.Types.ObjectId(reqData.employee_id);
  var project_id = reqData.project_id;
  var page = reqData.page;
  var limit = reqData.limit;
  var resdata = { };
  var _idstatus = mongoose.Types.ObjectId.isValid(emp_id);
  var _idstatus1 = mongoose.Types.ObjectId.isValid(project_id);  
  if (_idstatus == false) {
    var resData = {};
    var err = emp_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else if (_idstatus1 == false) {
    var resData = {};
    var err = project_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else{
    var project_id1 = mongoose.Types.ObjectId(project_id);    
    var query = {};
    if(flag == 0){
      query = {"assign_from": emp_id,"project_id":project_id1,"status":1}
    }
    else{
      query = {"assign_to": emp_id,"project_id":project_id1,"status":1}
    }
    model.paginate(query, {sort:{"due_date":-1}, page: page, limit: limit }, function(err, data) {
      //  model.find({"assign_to": assign_to,"project_id":project_id1}, function (err, data) {
        if(data && data.docs.length > 0){
         async.forEach(data.docs, function (task, callback) {
          var employee_id1 = mongoose.Types.ObjectId(task._doc.assign_from);        
          var employee_id = mongoose.Types.ObjectId(task._doc.assign_to);
          var act_id = mongoose.Types.ObjectId(task._doc.activity_id);    
          empmodel.find({ "_id": employee_id1 }, function (err, data4) {          
          empmodel.find({ "_id": employee_id }, function (err, data1) {
            projectsmodel.find({ "_id": project_id1 }, function (err, data2) {
              activities.find({ "_id": act_id }, function (err, data3) {     
                var task_id = mongoose.Types.ObjectId(task._doc._id);
                var spendtimes = {spendtimes: [] }                
                tasktime.find({ "pid": task_id }, function (err, data6) {
                  if(data && data.docs.length > 0){
                    // resdata = data[0]._doc;
                     async.forEach(data6, function (spendtime, callback) {
                      var dt = {};                
                      dt['start_date_time'] = spendtime.start_date_time;
                      dt['end_date_time'] = spendtime.end_date_time;  
                      dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                      spendtimes.spendtimes.push(dt);
                      count1 = count1 + 1;
                      callback();
                     }, function (err, cb) {
                        if(count1 >= data6.length){
                          task._doc.assign_from = data4[0]._doc;    
                          if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
                            task._doc.actual_hrs = task._doc.actual_hrs + " : 0 : 0 ";
                          }
                          else{
                           console.log("actual: " + task._doc.actual_hrs)                          
                           var hours =  Math.floor(task._doc.actual_hrs);
                           var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
                           var minutes = parseInt(((temp *3600)/60).toString());
                           var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                           task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                           console.log("Converted: " + task._doc.actual_hrs)                                
                          }          
                          task._doc.assign_to = data1[0]._doc;
                           task._doc.project_id = (data2.length > 0) ? data2[0]._doc : project_id1 ;
                          task._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ;;  
                          task._doc.spendtimes = spendtimes.spendtimes;    
                          task._doc.expire = (task._doc.due_date < new Date()) ? 1 : 0;
                          in_progress.tasks.push(task._doc);
                            count = count + 1;
                          callback();                    
                        }  
                     // return;
                     });
                  }
                  else{
                     count = count + 1;
                     callback();
                  }       
                })  
              })
            })
          })
         })
          }, function (err, cb) {
             if(count >= data.docs.length){
             /* if(in_progress && in_progress.tasks.length > 0){
                in_progress.tasks.sort(function(a,b){
              var c:any = new Date(a.due_date);
              var d:any = new Date(b.due_date);
              return c-d;
              });
              }*/
               tasks['In_Progress'] = in_progress.tasks;
               tasks["Pages"] = data.pages;
               tasks["Total"] = data.total;
              res.send(tasks);
              }  
              return;
          });  
        } 
        else{
          tasks['In_Progress'] = in_progress.tasks;
          tasks["Pages"] = data.pages;
          tasks["Total"] = data.total;
          res.send(tasks);
          return;
         }          
       })
  }
  
}

/*
  @author : Vaibhav Mali 
  @date : 05 Jan 2018
  @API : getUpcomingTasks
  @desc :Get Upcoming Tasks with pagination.
  */
getUpcomingTasks = (req, res) => {   
  var model = this.model;  
  var tasks = {};  
  var upcoming = {tasks:[]};
  var count = 0 , count1 = 0;
  var reqData =  req.body.reqData;
  var flag = reqData.flag;
  var emp_id = mongoose.Types.ObjectId(reqData.employee_id);
  var project_id = reqData.project_id;
  var page = reqData.page;
  var limit = reqData.limit;
  var resdata = { };
  var _idstatus = mongoose.Types.ObjectId.isValid(emp_id);
  var _idstatus1 = mongoose.Types.ObjectId.isValid(project_id);  
  if (_idstatus == false) {
    var resData = {};
    var err = emp_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else if (_idstatus1 == false) {
    var resData = {};
    var err = project_id + ' Id is invalid';
    resData['error'] = err;
    res.send(resData);
  }
  else{
    var project_id1 = mongoose.Types.ObjectId(project_id);
    var query = {};
    if(flag == 0){
      query = {"assign_from": emp_id,"project_id":project_id1,"status":0,"assign_date":{$gt:new Date()}}
    }
    else{
      query = {"assign_to": emp_id,"project_id":project_id1,"status":0,"assign_date":{$gt:new Date()}}
    }
    model.paginate( query, {sort:{"due_date":-1}, page: page, limit: limit }, function(err, data) {
      //  model.find({"assign_to": assign_to,"project_id":project_id1}, function (err, data) {
        if(data && data.docs.length > 0){
         async.forEach(data.docs, function (task, callback) {
          var employee_id1 = mongoose.Types.ObjectId(task._doc.assign_from);        
          var employee_id = mongoose.Types.ObjectId(task._doc.assign_to);
          var act_id = mongoose.Types.ObjectId(task._doc.activity_id);    
          empmodel.find({ "_id": employee_id1 }, function (err, data4) {          
          empmodel.find({ "_id": employee_id }, function (err, data1) {
            projectsmodel.find({ "_id": project_id1 }, function (err, data2) {
              activities.find({ "_id": act_id }, function (err, data3) {     
                var task_id = mongoose.Types.ObjectId(task._doc._id);
                var spendtimes = {spendtimes: [] }                
                tasktime.find({ "pid": task_id }, function (err, data6) {
                  if(data && data.docs.length > 0){
                    // resdata = data[0]._doc;
                     async.forEach(data6, function (spendtime, callback) {
                      var dt = {};                
                      dt['start_date_time'] = spendtime.start_date_time;
                      dt['end_date_time'] = spendtime.end_date_time;  
                      dt['actual_hrs'] = spendtime.actual_hrs ? spendtime.actual_hrs : 0;
                      spendtimes.spendtimes.push(dt);
                      count1 = count1 + 1;
                      callback();
                     }, function (err, cb) {
                        if(count1 >= data6.length){
                          task._doc.assign_from = data4[0]._doc;    
                          if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
                            task._doc.actual_hrs = task._doc.actual_hrs + " : 0 : 0 ";
                          }
                          else{
                           console.log("actual: " + task._doc.actual_hrs)                          
                           var hours =  Math.floor(task._doc.actual_hrs);
                           var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
                           var minutes = parseInt(((temp *3600)/60).toString());
                           var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
                           task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
                           console.log("Converted: " + task._doc.actual_hrs)                                
                          }          
                          task._doc.assign_to = data1[0]._doc;
                           task._doc.project_id = (data2.length > 0) ? data2[0]._doc : project_id1 ;
                          task._doc.activity_id = (data3.length > 0) ? data3[0]._doc : act_id ;;  
                          task._doc.spendtimes = spendtimes.spendtimes;    
                          upcoming.tasks.push(task._doc);
                            count = count + 1;
                          callback();                    
                        }  
                     // return;
                     });
                  }
                  else{
                     count = count + 1;
                     callback();
                  }       
                })  
              })
            })
          })
         })
          }, function (err, cb) {
             if(count >= data.docs.length){
             /* if(upcoming && upcoming.tasks.length > 0){
                upcoming.tasks.sort(function(a,b){
              var c:any = new Date(a.due_date);
              var d:any = new Date(b.due_date);
              return c-d;
              });
              }*/
               tasks['Upcoming'] = upcoming.tasks;
               tasks["Pages"] = data.pages;
               tasks["Total"] = data.total;
              res.send(tasks);
              }  
              return;
          });  
        } 
        else{
           tasks['Upcoming'] = upcoming.tasks;
           tasks["Pages"] = data.pages;
           tasks["Total"] = data.total;
           res.send(tasks);
           return;
         }          
       })
  }
  
}

/*
  @author : Vaibhav Mali 
  @date : 09 Jan 2018
  @API : getTaskHistory
  @desc :Get Task history with pagination.
  */
  getTaskHistory = (req, res) => {   
    var model = this.model;  
    var reqData =  req.body.reqData;
    var page = reqData.page;
    var limit = reqData.limit;
    var task_id = mongoose.Types.ObjectId(reqData._id); 
    var count = 0;   
    tasktime.paginate( { "pid": task_id },{sort:{"end_date_time":-1}, page: page, limit: limit }, function(err, data) {
        async.forEach(data.docs, function (task, callback) {
          if(Math.ceil(parseFloat(task._doc.actual_hrs)) === task._doc.actual_hrs){
            task._doc.actual_hrs = task._doc.actual_hrs + " : 0 : 0 ";
          }
          else{
            console.log("actual: " + task._doc.actual_hrs)                          
            var hours =  Math.floor(task._doc.actual_hrs);
            var temp = parseFloat(task._doc.actual_hrs) - Math.floor(parseFloat(task._doc.actual_hrs));
            var minutes = parseInt(((temp *3600)/60).toString());
            var seconds =  parseInt((temp * 3600).toString()) - (minutes * 60);
            task._doc.actual_hrs = (parseInt(hours.toString()) <= 9 ? "0" + hours : hours )+ " : " +(parseInt(minutes.toString()) <= 9 ? "0" + minutes : minutes )  + " : " + (parseInt(seconds.toString()) <= 9 ? "0" + seconds : seconds );
            console.log("Converted: " + task._doc.actual_hrs) 
          }        
          count = count + 1;
          callback();                       
        }, function (err, cb) {
          if(count >= data.docs.length){
             /* data.docs.sort(function(a,b){
              var c:any = new Date(a.end_date_time);
              var d:any = new Date(b.end_date_time);
              return d-c;
              });*/
              res.send(data);      
              return;
          }
        })
    })
  }


  /*
  @author : Vaibhav Mali 
  @date : 09 Jan 2018
  @API : getNewTasks
  @desc :Get In continue flow new tasks coming to us.
  */
getNewTasks = (req, res) => {   
  var model = this.model;  
  var emp_id1 = req.params.id;
  var emp_id = mongoose.Types.ObjectId(emp_id1);
  var tasks = {tasks:[]};
  model.find({ "assign_to": emp_id,"flag" :0 }, function (err, data) {
    var count = 0;
    if(data && data.length > 0){
      async.forEach(data, function (task, callback) {     
        var task_id = mongoose.Types.ObjectId(task._doc._id);
        model.findOneAndUpdate({ "_id": task_id}, { "$set": { "read" : 1}}).exec(function (err, data1) {
          var employee_id = mongoose.Types.ObjectId(task._doc.assign_from);  
          var project_id = mongoose.Types.ObjectId(task._doc.project_id);     
          empmodel.find({ "_id": employee_id }, function (err, data2) {          
             projectsmodel.find({ "_id": project_id }, function (err, data3) {
                task._doc['message'] = "New task assigned by " + data2[0]._doc.name + " for project "+data3[0]._doc.project_name;
                tasks.tasks.push(task);
                count = count + 1;
                callback();
              })
          })
        })
      }, function (err, cb) {
         if(count >= data.length){
           res.send(tasks);
         }
      });
    }
    else{
      res.send(tasks);      
    }
  })
}

/*
  @author : Vaibhav Mali 
  @date : 09 Jan 2018
  @API : updateTaskReadStatus
  @desc :Update task status which read.
  */
  updateTaskReadStatus = (req, res) => {   
    var model = this.model;  
    var project_id = mongoose.Types.ObjectId(req.params.id);
    var resData = {};
    model.update({ "project_id": project_id}, { "$set": { "flag" : 1}},{multi:true}).exec(function (err, data) {
      resData['success'] = true;
      res.send(resData);
    })
  }


}