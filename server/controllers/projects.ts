import Projects from '../models/projects';
import UserAcceptCtrl from './user_accept';
var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
var projectsmodel = mongoose.model('projects');
var activities = mongoose.model('activities');
var followers = mongoose.model('followers');
var empmodel = mongoose.model('employees');
var User_accept = mongoose.model('user_accept');
const nodemailer = require('nodemailer');
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
    var me = this;
    var projects = req.body.reqData;
    const current_date = new Date();
    var model = projectsmodel;
    var count = 0;
    var resData = {};
    var dt = {
        success: ""
    };
    var successData = {
        successData : []
    }
    var successAssign = {
      successAssign : []
    }
     var failedAssign = {
      failedAssign : []
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
    var flag = 0;
    if(req && req.user){
      async.forEach(projects, function (project, callback) {
                if(project && (project.project_id != null && project.project_id != undefined && project.project_id != "")){
                    //If project is already exist.
                      flag = 0;
                     _idstatus = mongoose.Types.ObjectId.isValid(project.project_id);    
                    if (_idstatus == false) {
                        //Project id is invalid.
                        count = count + 1;
                        var err1 = project.project_id + ' Project Id is invalid';
                        project.error = err1;
                        flag = 1;
                        failedData.failedData.push(project);
                        callback();
                    }
                    else{
                         var project_id = mongoose.Types.ObjectId(project.project_id);
                         model.find({ "_id": project_id}, function (err, data1) {
                              if(data1 && data1.length > 0){ 
                                       model.findOneAndUpdate({ "_id": project_id}, { "$set": { "project_name": project.project_name,"desc" :project.desc ? project.desc:data1[0].doc.desc}}).exec(function (err, data2) {
                                             if (err) {
                                                  count = count + 1;
                                                  project.error = err;                                    
                                                  failedData.failedData.push(project);
                                                  flag = 1;
                                                  callback();
                                             }
                                             else {
                                              followers.find({ "email": req.user.emails[0].value,"project_id":project_id}, function (err, data3) {                           
                                                  followers.findOneAndUpdate({ "email": req.user.emails[0].value,"project_id":project_id}, { "$set": { "role" : project.role ? project.role : data3[0]._doc.role,"modify_date": current_date }}).exec(function (err, data4) {
                                                        var cnt = 0;
                                                       activities.remove({ project_id: project.project_id }, function(err) {
                                                           if (err) {
                                                              count = count + 1;
                                                              project.error = err;           
                                                              failedData.failedData.push(project);
                                                              flag = 1;
                                                              callback();
                                                           }
                                                          else {
                                                              if(project && project.activities != "" && project.activities != null && project.activities != undefined){
                                                                   async.forEach(project.activities, function (activity, callback) {
                                                                   //Activity not present as project is new.
                                                                   var obj = new activities();
                                                                  obj.activity_name = activity.activity_name;
                                                                    obj.pid = project_id;
                                                                   obj.save(function (err) {
                                                                    if (err && err.code === 11000) {
                                                                        cnt = cnt + 1; 
                                                                       activity.project_id = project_id;
                                                                       activity.project_name = project.project_name;  
                                                                       activity.error = "Activity name is already exist";                
                                                                       failedactivity.failedactivity.push(activity);
                                                                     callback();
                                                                 }
                                                                 else if (err) {
                                                                       cnt = cnt + 1; 
                                                                       activity.project_id = project_id;
                                                                       activity.project_name = project.project_name;  
                                                                       activity.error = "Activity name is already exist";                
                                                                       failedactivity.failedactivity.push(activity);
                                                                       callback();
                                                                  }
                                                                else {
                                                                      cnt = cnt + 1;
                                                                      callback();
                                                                 }
                                                                });
                                            
                                                                } , function (err, cb) {
                                                                     if(cnt >= project.activities.length){
                                                                        count = count + 1;
                                                                        if(flag !=  1){
                                                                            successData.successData.push(project);
                                                                            var assignto = project.assign_to;
                                                                            if(assignto && assignto.length > 0){
                                                                                var assigncount = 0;
                                                                                async.forEach(assignto, function (assignee, callback) {
                                                                                  empmodel.find({ "email": assignee.to_email }, function (err, data) {                   
                                                                                   //Check whether email is registered or not.
                                                                                   if(data && data.length > 0){
                                                                                    // If registered
                                                                                    User_accept.find({ "from_email": req.user.emails[0].value,"to_email": assignee.to_email,"project_id": project_id,"accept" : 0 }, function (err, data3) {
                                                                                      User_accept.find({ "from_email": req.user.emails[0].value,"to_email": assignee.to_email,"project_id": project_id,"accept" : 1 }, function (err, data4) {
                                                                                            if((data3 && data3.length == 0) || (data4 && data4.length == 0)){
                                                                                              var reqData = {};
                                                                                              reqData["from_email"] = req.user.emails[0].value;
                                                                                              reqData["to_email"] = assignee.to_email;
                                                                                              reqData["project_id"] = project.project_id;
                                                                                              var userAcceptCtrl = new UserAcceptCtrl();
                                                                                              userAcceptCtrl.request_join(reqData,function cb(err,resData){
                                                                                            //  var assignresult = me.request_join(reqData);                                                                        
                                                                                             // console.log(resData);
                                                                                              if(resData && resData.error){
                                                                                                  project["mailerror"] = resData.error;
                                                                                                  failedAssign.failedAssign.push(assignee);
                                                                                              }
                                                                                              else{
                                                                                                  successAssign.successAssign.push(assignee);
                                                                                                  project["status"] =resData.status; 
                                                                                                  project["message"] =resData.message; 
                                                                                              }
                                                                                              callback();
                                                                                              })
                                                                                            } 
                                                                                            else{
                                                                                              project["status"] = 3; 
                                                                                              callback();
                                                                                            }
                                                                                        })
                                                                                    })
                                                                                   }
                                                                                   else{
                                                                                        assignee.error = "Assignee email is not registered";
                                                                                        failedAssign.failedAssign.push(assignee);
                                                                                        callback();  
                                                                                    }
                                                                                  }) 
                                                                                     assigncount = assigncount + 1; 
                                                                                  }, function (err, cb) {
                                                                                      if(assigncount >= assignto.length){
                                                                                        callback();
                                                                                      }  
                                                                                });
                                                                                                              
                                                                            }
                                                                            else{
                                                                              callback();
                                                                            }
                                                                        //    callback();
                                                                        }
                                                                        else{
                                                                           callback();
                                                                        }
                                                                     }
                                                                })
                                                              }
                                                              else{
                                                                 count = count + 1;
                                                                 callback();
                                                              }
                                                          }
                                                       });
                                                  })
                                                })
                                             }
                                      })
                              }
                              else{
                                    //If provided project Id is wrong.
                                    count = count + 1;
                                    var err1 = project.project_id + ' Project Id is invalid';
                                    project.error = err1;
                                    failedData.failedData.push(project);
                                    callback();
                              }
                         })
                    }   
               }
               else{
                   //If New Project
                   flag = 0;                          
                   var obj = new model();
                   obj.project_name = project.project_name;
                   obj.desc = project.desc ? project.desc : "";
                   obj.save(function (err,projectdata1) {
                        if (err && err.code === 11000) {
                             flag = 1;
                             count = count + 1;
                             err = project.project_name + ' Project is already exist'
                             project.err = err;
                             failedData.failedData.push(project);
                              callback();
                           }
                           else if (err) {
                             flag = 1;
                             count = count + 1;
                            project.err = err;                            
                             failedData.failedData.push(project);
                             callback();
                           }
                           else {
                            var prtempid = mongoose.Types.ObjectId(projectdata1.id);
                            var obj = new followers();
                            
                           obj.ismanager = 1;

                            obj.email = req.user.emails[0].value;
                            obj.role = project.role ? project.role : "";                                                           
                            obj.create_date = current_date;
                            obj.modify_date = current_date;
                            obj.project_id = prtempid
                            obj.save(function (err) {
                              if (err) {
                                count = count + 1;
                                flag = 1;
                                project.error = err;                               
                                failedData.failedData.push(project);
                                callback();
                              }
                              else{
                                    var cnt = 0;
                                    activities.remove({ project_id: prtempid }, function(err) {
                                         if (err) {
                                                count = count + 1;
                                                project.error = err;                          
                                                failedData.failedData.push(project);
                                                callback();
                                         }
                                        else {
                                            if(project && project.activities != "" && project.activities != null && project.activities != undefined){
                                                async.forEach(project.activities, function (activity, callback) {
                                                    //Activity not present as project is new.
                                                    var obj = new activities();
                                                    obj.activity_name = activity.activity_name;
                                                    obj.pid = prtempid;
                                                    obj.save(function (err) {
                                                     if (err && err.code === 11000) {
                                                        cnt = cnt + 1; 
                                                        activity.project_id = prtempid;
                                                         activity.project_name = project.project_name;  
                                                         activity.error = "Activity name is already exist";                
                                                         failedactivity.failedactivity.push(activity);
                                                                callback();
                                                          }
                                                          else if (err) {
                                                                cnt = cnt + 1; 
                                                                activity.project_id = prtempid;
                                                                activity.project_name = project.project_name;  
                                                                activity.error = "Activity name is already exist";                
                                                                failedactivity.failedactivity.push(activity);
                                                                       callback();
                                                           }
                                                           else {
                                                                 cnt = cnt + 1;
                                                                 callback();
                                                            }
                                                        });
                                            
                                                    } , function (err, cb) {
                                                        if(cnt >= project.activities.length){
                                                            count = count + 1;
                                                            if(flag !=  1){
                                                              successData.successData.push(project);
                                                              var assignto = project.assign_to;
                                                              if(assignto && assignto.length > 0){
                                                                  var assigncount = 0;
                                                                  async.forEach(assignto, function (assignee, callback) {
                                                                    empmodel.find({ "email": assignee.to_email }, function (err, data) {                   
                                                                     //Check whether email is registered or not.
                                                                     if(data && data.length > 0){
                                                                      // If registered
                                                                       var reqData = {};
                                                                       reqData["from_email"] = req.user.emails[0].value;
                                                                       reqData["to_email"] = assignee.to_email;
                                                                       reqData["project_id"] = projectdata1.id;
                                                                       var userAcceptCtrl = new UserAcceptCtrl();
                                                                       userAcceptCtrl.request_join(reqData,function cb(err,resData){
                                                                     //  var assignresult = me.request_join(reqData);                                                                        
                                                                      // console.log(resData);
                                                                       if(resData && resData.error){
                                                                           project["mailerror"] = resData.error;
                                                                           failedAssign.failedAssign.push(assignee);
                                                                       }
                                                                       else{
                                                                           successAssign.successAssign.push(assignee);
                                                                           project["status"] =resData.status; 
                                                                           project["message"] =resData.message; 
                                                                       }
                                                                       callback();
                                                                       })
                                                                                
                                                                     }
                                                                     else{
                                                                          assignee.error = "Assignee email is not registered";
                                                                          failedAssign.failedAssign.push(assignee);
                                                                          callback();  
                             
                                                                      }
                                                                    
                                                                    }) 
                                                                       assigncount = assigncount + 1; 
                                                                    }, function (err, cb) {
                                                                        if(assigncount >= assignto.length){
                                                                          callback();
                                                                        }  
                                                                  });
                                                                                                
                                                              }
                                                              else{
                                                                callback();
                                                              }
                                                            }
                                                            else{
                                                                callback();
                                                            }
                                                         }
                                                     })
                                                    }
                                                    else{
                                                        count = count + 1;
                                                        callback();
                                                    }
                                               }
                                    });
                              }
                          })

                   }
              })
            }
        }, function (err, cb) {
          var result = {};
          result['successProjects'] = successData;
          result['failedProjects'] = failedData;
          result['failedActivities'] = failedactivity;
          result['successAssign'] = successAssign;
          result['failedAssign'] = failedAssign;        
           if(count >= projects.length){
             res.send(result);
           }  
         return;
      });
    }
  
    else{
        resData["res_status"] = 404;
        resData["error"] = "Please login and continue";
        res.send(resData);
    }
}


   /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : getProjectDetails
  @desc :Get project details by project Id.
  */
   getProjectDetails = (req, res) => {   
    const current_date = new Date();
    var projectid = req.params.id;
    var model = projectsmodel;
    var tempactivities = {activities: []};
    var project = {};
    var followertemp = {followers:[]}
    var project_id = mongoose.Types.ObjectId(projectid);
    if(req && req.user){
    model.find({ "_id": project_id }, function (err, data2) {
      if(data2 && data2.length > 0){
        followers.find({ "project_id":project_id}, function (err, data4) {                         
             project["_id"] = data2[0]._doc._id;                              
             project["project_name"] = data2[0]._doc.project_name;
             project["desc"] = data2[0]._doc.desc; 
             activities.find({ "pid": project_id }, function (err, data3) {
              if(data3 && data3.length > 0){
                  var count = 0;
                  async.forEach(data3, function (activity, callback) {
                        var tempdata = {};
                        tempdata["_id"] = activity._doc._id;
                        tempdata["activity_name"] = activity._doc.activity_name;
                        tempactivities.activities.push(tempdata)
                        count = count + 1;
                        if(count >= data3.length){
                          var count1 = 0;
                         User_accept.find({ "from_email": req.user.emails[0].value,"project_id" : project_id }, function (err, data9) {                                   
                          async.forEach(data4, function (follower, callback) { 
                            empmodel.find({ "email": follower._doc.email}, function (err, data8) {
                              if(req && req.user && req.user.emails[0].value == follower._doc.email){
                                  project["employee_id"] = data8[0]._id;
                                  project["name"] = data8[0].name;
                                  project["act_status"] = data8[0].act_status;
                                  project["type"] = data8[0].type;
                                  project["role"] = follower._doc.role;
                                  project["ismanager"] = follower._doc.ismanager;                                  
                                  project["create_date"] = follower._doc.create_date;
                                  project["modify_date"] = follower._doc.modify_date;  
                                  count1 = count1 + 1;                                  
                                  callback();                                                   
                              }
                              else{
                                follower._doc.employee_id = data8[0]._id;
                                follower._doc.name = data8[0].name;
                                follower._doc.act_status = data8[0].act_status;
                                follower._doc.type = data8[0].type;
                                follower._doc.accept = 1;                                 
                                followertemp.followers.push(follower._doc)
                                count1 = count1 + 1;
                                callback();
                              }
                           // })
                            })
                           }, function (err, cb) {
                             if(count1 >= data4.length){
                               var count2 = 0
                             if(data9 && data9.length > 0) {
                              async.forEach(data9, function (requestuser, callback) { 
                                followers.find({ "project_id":requestuser._doc.project_id,"email":requestuser._doc.to_email }, function (err, data10) {                         
                                  empmodel.find({ "email": requestuser._doc.to_email}, function (err, data11) {
                                      if(data10 && (data10.length == 0) && (requestuser._doc.accept == 0)){
                                        var followert = {};
                                        followert["employee_id"] = data11[0]._id;
                                        followert["name"] = data11[0].email;
                                        followert["role"] = data11[0].role;
                                        followert["email"] = data11[0].name;                                                                             
                                        followert["act_status"] = data11[0].act_status;
                                        followert["type"] = data11[0].type;
                                        followert["accept"] = 0;
                                        count2 = count2 + 1;
                                        followertemp.followers.push(followert);
                                        callback(); 
                                      } 
                                      else if(requestuser._doc.accept == -1)
                                      {
                                        followert["employee_id"] = data11[0]._id;
                                        followert["name"] = data11[0].name;
                                        followert["role"] = data11[0].role;
                                        followert["email"] = data11[0].name;  
                                        followert["act_status"] = data11[0].act_status;
                                        followert["type"] = data11[0].type;
                                        followert["accept"] = -1;
                                        followert["message"] = data11[0].name + " has canceled your project request";
                                        User_accept.remove({ "from_email": req.user.emails[0].value,"to_email": requestuser._doc.to_email,"project_id" : project_id }, function(err) {
                                          count2 = count2 + 1;
                                          followertemp.followers.push(followert)
                                          callback();
                                        }) 
                                      }
                                      else{
                                        count2 = count2 + 1;
                                        callback();                                        
                                      }
                                     
                                  })
                                })

                              }, function (err, cb) {
                                if(count2 >= data9.length){   
                                  callback();
                                } 
                              });  

                            }
                            else{
                              callback();
                            }
                            } 
                           });  

                          })
                        }
                        else{
                        callback();
                        }                                
                        }, function (err, cb) {
                          if(count >= data3.length){
                             count = 0; 
                             project["activities"] = tempactivities.activities;
                             project["followers"] = followertemp.followers;
                             res.send(project);  

                         }
                         return;        
                     });
                    
            } 
            else{
                 count = 0;
                 if(data4 && data4.length > 0 ){
                    async.forEach(data4, function (follower, callback) {
                      empmodel.find({ "email": follower._doc.email}, function (err, data8) {
                        if(req && req.user && req.user.emails[0].value == follower._doc.email){
                          project["employee_id"] = data8[0]._id;
                          project["name"] = data8[0].name;
                          project["act_status"] = data8[0].act_status;
                          project["type"] = data8[0].type;
                          project["role"] = follower._doc.role;
                          project["create_date"] = follower._doc.create_date;
                          project["modify_date"] = follower._doc.modify_date; 
                          count = count + 1;                          
                          callback();                                                   
                      }
                      else{
                        follower._doc.employee_id = data8[0]._id;
                        follower._doc.name = data8[0].name;
                        follower._doc.act_status = data8[0].act_status;
                        follower._doc.type = data8[0].type;
                        followertemp.followers.push(follower._doc)
                        count = count + 1;
                        callback();
                      }
                      })
                    }, function (err, cb) {
                        if(count >= data4.length){
                           project["activities"] = tempactivities.activities;
                           project["followers"] = followertemp.followers;
                           res.send(project);  
                          } 
                      });  
                   } 
                 else{
                       project["activities"] = tempactivities.activities;
                       project["followers"] = followertemp.followers;
                       res.send(project);  
                 }                                    
             }
           }) 
         }).sort({ "modify_date" : -1});  
        }
       else{
           project["error"] = "Incorrect Project Id";
           res.send(project);  
        }
    })
  }
  else{
    project["error"] = "You are not member of status please login with google first";
    res.send(project);  
  }
}

}