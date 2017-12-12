import Projects from '../models/projects';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
var projectsmodel = mongoose.model('projects');
var activities = mongoose.model('activities');
var followers = mongoose.model('followers');
var empmodel = mongoose.model('employees');
var moment=require("moment");


export default class ProjectsCtrl  {

  model = Projects;

  
/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : save_update_projects
  @desc :Save and update projects.
  */
  save_update_projects = (req, res) => {
    var projects = req.body.reqData;
    const current_date = new Date();
    //console.log(current_date);    
    //current_date.setDate(Number(current_date.getDate()) + 60);
   // console.log(current_date);
    var model = projectsmodel;
    var sendstatus = 0;
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
    var failedactivity = {
      failedactivity : []
    }
    var errorData = {
        errors : []
    };
    var _idstatus:boolean;
    var length = projects.length ? projects.length : 0;
    var projectids = "";
    async.forEach(projects, function (project, callback) {
        var email = project.email;  
        empmodel.find({ "email": email}, function (err, data) {
            if(data && data.length > 0){
                //If follower is exist 
                if(project && (project.project_id != null && project.project_id != undefined && project.project_id != "")){
                     _idstatus = mongoose.Types.ObjectId.isValid(project.project_id);    
                     if (_idstatus == false) {
                        count = length;
                        var err1 = project.project_id + ' Project Id is invalid';
                        project.error = err1;
                        failedData.failedData.push(project);
                   //     errorData.errors.push(err1)
                        callback();
                      }
                    else{
                       var project_id = mongoose.Types.ObjectId(project.project_id);
                       model.find({ "_id": project_id}, function (err, data1) {
                        if(data1 && data1.length > 0){
                           
                          //if project_id is exist then update project.
                          var flag = 0;
                          model.findOneAndUpdate({ "_id": project_id}, { "$set": { "project_name": project.project_name }}).exec(function (err, data2) {
                            if (err) {
                                   count = length; 
                                   sendstatus = 1;   
                                   project.err = err;                                    
                                   failedData.failedData.push(project);
                                  // errorData.errors.push(err)
                                   callback();
                            }
                            else {
                              followers.findOneAndUpdate({ "email": email,"project_id":project_id}, { "$set": { "modify_date": current_date }}).exec(function (err, data6) {
                                 var cnt = 0;
                                 var actlength = project.activities.length ? project.activities.length : 0;
                                async.forEach(project.activities, function (activity, callback) {
                                if(activity.activity_id != null && activity.activity_id != "" && activity.activity_id != undefined){
                                    _idstatus = mongoose.Types.ObjectId.isValid(activity.activity_id);    
                                    if (_idstatus == false) {
                                       count = length;
                                       var err1 = activity.activity_id + ' Activity Id is invalid';
                                       //errorData.errors.push(err1)
                                       activity.project_id = project.project_id;
                                       activity.project_name = project.project_name;  
                                       activity.error = err1;  
                                       failedactivity.failedactivity.push(activity);
                                       
                                       callback();
                                   } 
                                  else{
                                    var activity_id = mongoose.Types.ObjectId(activity.activity_id);                                    
                                   activities.find({ "_id": activity_id}, function (err, data4) {
                                        if(data4 && data4.length > 0){
                                          //If activity already exist
                                          activities.findOneAndUpdate({ "_id": activity_id}, { "$set": { "activity_name": activity.activity_name }}).exec(function (err, data3) {
                                             if (err) {
                                              flag = 1;
                                              cnt = length; 
                                              sendstatus = 1;    
                                              activity.project_id = project.project_id;
                                              activity.project_name = project.project_name;  
                                              activity.error = err;                                 
                                              failedactivity.failedactivity.push(activity);
                                             // errorData.errors.push(err)
                                              callback();
                                             }
                                             else{
                                                //successData.successData.push(activity);
                                                callback();
                                             }
                                            
                                          })  

                                        }
                                        else{
                                          //If activity not present

                                          var obj = new activities();
                                          obj.activity_name = activity.activity_name;
                                          obj.pid = project_id;
                                          obj.save(function (err) {
                                            if (err && err.code === 11000) {
                                              flag = 1;
                                              cnt = length; 
                                              sendstatus = 1;    
                                              activity.project_id = project.project_id;
                                              activity.project_name = project.project_name;  
                                              activity.error = "Activity name is already exist";                                 
                                              failedactivity.failedactivity.push(activity);
                                              callback();
                                           }
                                           else if (err) {
                                              flag = 1;
                                              cnt = length; 
                                              activity.project_id = project.project_id;
                                              activity.project_name = project.project_name;  
                                              activity.error = "Activity name is already exist";                                 
                                              failedactivity.failedactivity.push(activity);
                                              callback();
                                           }
                                           else {
                                        
                                              callback();
                                            }
                                          });
                                           
                                          }
                                      })
                                     }
                                  }
                                  else{
                                    //If activity not present

                                    var obj = new activities();
                                    obj.activity_name = activity.activity_name;
                                    obj.pid = project_id;
                                    obj.save(function (err) {
                                      if (err && err.code === 11000) {
                                        flag = 1;
                                        cnt = length; 
                                        sendstatus = 1;    
                                        activity.project_id = project.project_id;
                                        activity.project_name = project.project_name;  
                                        activity.error = "Activity name is already exist";                                 
                                        failedactivity.failedactivity.push(activity);
                                        callback();
                                     }
                                     else if (err) {
                                        flag = 1;
                                        cnt = length; 
                                        activity.project_id = project.project_id;
                                        activity.project_name = project.project_name;  
                                        activity.error = "Activity name is already exist";                                 
                                        failedactivity.failedactivity.push(activity);
                                        callback();
                                     }
                                     else {
                                     
                                          callback();
                                     }
                                    });
                                  }
                                    cnt = cnt + 1;
                                 } , function (err, cb) {
                                  if(flag != 1){
                                    dt.success = "true";
                                    successData.successData.push(project);
                                    }
                                    callback();
                              
                              });
                               
                             })
                        
                              }
                            });
                          }
                          else{
                            //Save project (New project)
                            var flag = 0;                           
                            var obj = new model();
                            obj.project_name = project.project_name;
                            obj.save(function (err,projectdata) {
                              if (err && err.code === 11000) {
                               count = length;
                               sendstatus = 1;
                               err = project.project_name + ' Project is already exist'
                             //  errorData.errors.push(err)
                               project.err = err;
                               failedData.failedData.push(project);
                                callback();
                             }
                             else if (err) {
                               count = length;
                               sendstatus = 1;
                               //errorData.errors.push(err)
                               project.err = err;                               
                               failedData.failedData.push(project);
                               callback();
                             }
                             else {
                              var prtempid = mongoose.Types.ObjectId(projectdata.id);
                              var obj = new followers();
                              obj.email = project.email;
                              obj.create_date = current_date;
                              obj.modify_date = current_date;
                              obj.project_id = prtempid
                              obj.save(function (err) {
                                if (err) {
                                  count = length;
                                  sendstatus = 1;
                                  //errorData.errors.push(err)
                                  project.err = err;                               
                                  failedData.failedData.push(project);
                                  callback();
                                }
                                else{
                                  var cnt = 0;
                                  var actlength = project.activities.length ? project.activities.length : 0;
                                  async.forEach(project.activities, function (activity, callback) {
                                           //Activity not present as project is new.
                                           var obj = new activities();
                                           obj.activity_name = activity.activity_name;
                                           obj.pid = prtempid;
                                           obj.save(function (err) {
                                             if (err && err.code === 11000) {
                                               flag = 1;
                                               cnt = length; 
                                               sendstatus = 1;    
                                               activity.project_id = prtempid;
                                               activity.project_name = project.project_name;  
                                               activity.error = "Activity name is already exist";                                 
                                               failedactivity.failedactivity.push(activity);
                                               callback();
                                            }
                                            else if (err) {
                                               flag = 1;
                                               cnt = length; 
                                               activity.project_id = prtempid;
                                               activity.project_name = project.project_name;  
                                               activity.error = "Activity name is already exist";                                 
                                               failedactivity.failedactivity.push(activity);
                                               callback();
                                            }
                                            else {
                                               
                                              callback();
                                             }
                                           });
                                            
                                       cnt = cnt + 1;
                                      } , function (err, cb) {
                                    
                                       if(flag != 1){
                                        dt.success = "true";
                                        successData.successData.push(project);
                                      }
                                     callback();
    
                                  
                                     });
                                     
                                   // })
                                    }
                                 });
                               
                                }
                              }) 
                           }
 
                        })   

                      }
                   }
                   else{      
                          //Save project (New project)
                          var flag = 0;                          
                          var obj = new model();
                          obj.project_name = project.project_name;
                          obj.save(function (err,projectdata1) {
                            if (err && err.code === 11000) {
                             count = length;
                             sendstatus = 1;
                             err = project.project_name + ' Project is already exist'
                          //   errorData.errors.push(err)
                             project.err = err;
                             failedData.failedData.push(project);
                              callback();
                           }
                           else if (err) {
                             count = length;
                             sendstatus = 1;
                            // errorData.errors.push(err)
                            project.err = err;                            
                             failedData.failedData.push(project);
                             callback();
                           }
                           else {
                            var prtempid = mongoose.Types.ObjectId(projectdata1.id);
                            var obj = new followers();
                            obj.email = project.email;
                            obj.create_date = current_date;
                            obj.modify_date = current_date;
                            obj.project_id = prtempid
                            obj.save(function (err) {
                              if (err) {
                                count = length;
                                sendstatus = 1;
                                //errorData.errors.push(err)
                                project.err = err;                               
                                failedData.failedData.push(project);
                                callback();
                              }
                              else{
                                var cnt = 0;
                                var actlength = project.activities.length ? project.activities.length : 0;
                                async.forEach(project.activities, function (activity, callback) {
                                         //Activity not present as project is new.
                                         var obj = new activities();
                                         obj.activity_name = activity.activity_name;
                                         obj.pid = prtempid;
                                         obj.save(function (err) {
                                           if (err && err.code === 11000) {
                                             flag = 1;
                                             cnt = length; 
                                             sendstatus = 1;    
                                             activity.project_id = prtempid;
                                             activity.project_name = project.project_name;  
                                             activity.error = "Activity name is already exist";                                 
                                             failedactivity.failedactivity.push(activity);
                                             callback();
                                          }
                                          else if (err) {
                                             flag = 1;
                                             cnt = length; 
                                             activity.project_id = prtempid;
                                             activity.project_name = project.project_name;  
                                             activity.error = "Activity name is already exist";                                 
                                             failedactivity.failedactivity.push(activity);
                                             callback();
                                          }
                                          else {
                                             
                                            callback();
                                           }
                                         });
                                          
                                     cnt = cnt + 1;
                                    } , function (err, cb) {
                                  
                                     if(flag != 1){
                                      dt.success = "true";
                                      successData.successData.push(project);
                                    }
                                   callback();                              
                                   });
                                   
                                 // })
                               }
                             });
                           }
                         });
                   }
                }
                else{
                   // if follower not exist
                   count = length; 
                   sendstatus = 1;     
                   var err1 = "Employee email is unauthorized"   
                   project.err = err1;                   
                   failedData.failedData.push(project);
                  // errorData.errors.push(err1)
                   callback();
                }
                  
            }) 
      count = count + 1;
  
    }, function (err, cb) {
        var result = {};
        result['successProjects'] = successData;
        result['failedProjects'] = failedData;
        result['failedActivities'] = failedactivity;
      //  result['errors'] = errorData;
          if(count >= length){
            res.send(result);
          }  
        return;
    });
  };

  
/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : getProjectDetails
  @desc :Get project details.
  */
  getProjectDetails = (req, res) => {   
    const current_date = new Date();
    var projectid = req.params.id;
    var model = projectsmodel;
    var tempactivities = {activities: []};
    var project = {};
    var project_id = mongoose.Types.ObjectId(projectid);
    model.find({ "_id": project_id }, function (err, data2) {
      if(data2 && data2.length > 0){
          project["_id"] = data2[0]._doc._id;                              
          project["project_name"] = data2[0]._doc.project_name;
          activities.find({ "pid": project_id }, function (err, data3) {
              if(data3 && data3.length > 0){
                  var count = 0;
                  async.forEach(data3, function (activity, callback) {
                        var tempdata = {};
                        tempdata["_id"] = activity._doc._id;
                        tempdata["activity_name"] = activity._doc.activity_name;
                        tempactivities.activities.push(tempdata)
                        count = count + 1;
                        callback();                                
                    }, function (err, cb) {
                          if(count >= data3.length){
                            project["activities"] = tempactivities.activities;
                            res.send(project);                                                      
                          }
                     });
              } 
              else{
                  project["activities"] = tempactivities.activities;
                  res.send(project);                                    
              }
          })                   
        }
       else{
           project["error"] = "Incorrect Project Id";
           res.send(project);  
        }
    })
   }

}