import Tasks from '../models/tasks';
import tasktime from '../models/tasktime';
import followers from '../models/followers';


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
      model.find({"assign_from": assign_from,"project_id":project_id1}, function (err, data) {
      if(data && data.length > 0){
       async.forEach(data, function (task, callback) {
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
                if(data && data.length > 0){
                   resdata = data[0]._doc;
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
        if(count >= data.length){
          var i = 0,j = 0;
          for (i = 0; i < tasktemp.tasks.length - 1; i++) {
            for (j = i + 1; j < tasktemp.tasks.length; j++) {
                var temp;
                if (tasktemp.tasks[i].stime < tasktemp.tasks[j].stime) {
                    temp = tasktemp.tasks[i];
                    tasktemp.tasks[i] = tasktemp.tasks[j];
                    tasktemp.tasks[j] = temp;
                }
            }
        }
          tasks['tasks'] = tasktemp.tasks;
          res.send(tasks);
        }  
        return;
      });  
    } 
    else{
       tasks['tasks'] = tasktemp.tasks;
       res.send(tasks);
    }          
   }).sort({stime: -1});
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
      model.find({"assign_to": assign_to,"project_id":project_id1}, function (err, data) {
      if(data && data.length > 0){
       async.forEach(data, function (task, callback) {
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
                if(data && data.length > 0){
                   resdata = data[0]._doc;
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
        if(count >= data.length){
          var i = 0,j = 0;
          for (i = 0; i < tasktemp.tasks.length - 1; i++) {
            for (j = i + 1; j < tasktemp.tasks.length; j++) {
                var temp;
                if (tasktemp.tasks[i].stime < tasktemp.tasks[j].stime) {
                    temp = tasktemp.tasks[i];
                    tasktemp.tasks[i] = tasktemp.tasks[j];
                    tasktemp.tasks[j] = temp;
                }
            }
        }
          tasks['tasks'] = tasktemp.tasks;
          res.send(tasks);
        }  
        return;
      });  
    } 
    else{
      tasks['tasks'] = tasktemp.tasks;
      res.send(tasks);
    }          
   }).sort({stime: -1});
 };
}

}