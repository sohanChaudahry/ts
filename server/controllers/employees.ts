import Employees from '../models/employees';
import followers from '../models/followers';
import projects from '../models/projects';
var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
var Followers = mongoose.model('followers');
var empmodel = mongoose.model('employees');
var projectsmodel = mongoose.model('projects');
var activities = mongoose.model('activities');
export default class EmployeesCtrl  {
  followers = followers;
  projects = projects;
  model = Employees;


  /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : save_update_Employees
  @desc : Save and update employees.
  */
  save_update_Employees = (req, res) => {
    var followers = Followers;    
    var employees = req.body.reqData;
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
    var length = employees.length ? employees.length : 0;
    async.forEach(employees, function (employee, callback) {
        if(employee && employee._id != "" && employee._id != null && employee._id != undefined){
          //If employee is already exist
        var _idstatus = mongoose.Types.ObjectId.isValid(employee._id);
        if (_idstatus == false) {
               count = length;
              var err = employee._id + ' Employee Id is invalid';    
              employee.error = err;           
              failedData.failedData.push(employee);
              callback();
        }
        var employee_id = mongoose.Types.ObjectId(employee._id);
        empmodel.find({ "_id": employee_id }, function (err, data) {
              if(data && data.length > 0){
             //   followers.findOneAndUpdate({ "email": employee.email}, { "$set": { "modify_date": current_date }}).exec(function (err, data6) {
                   //if(data6 && data6.length > 0){
                     empmodel.findOneAndUpdate({ "_id": employee_id}, { "$set": { "name": employee.name ? employee.name : data[0]._doc.name , "email": employee.email ? employee.email : data[0]._doc.email, "address": employee.address ? employee.address : data[0]._doc.address,"type": employee.type ? employee.type : data[0]._doc.type, "modify_date": current_date} }).exec(function (err, data3) {
                         if (err) {
                               count = length; 
                               employee.error = err;                                       
                               failedData.failedData.push(employee);
                               callback();
                         }
                         else {
                                dt.success = "true";
                                successData.successData.push(employee);
                                callback();
                          }
                      });
           //         }
                 //   else{
                   
               //     }
            //    })
              }
              else{
                    count = length; 
                    employee.error = "Please login with google.";                                       
                    failedData.failedData.push(employee);
                    callback();  
               }
  
            })
         }
         else{
           //If employee is new
            count = length; 
            employee.error = "Please login with google.";                                       
            failedData.failedData.push(employee);
            callback();  
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
  @API : getEmployeeDetails
  @desc : Get employee details by Id.
  */
  getEmployeeDetails = (req, res) => {   
    var model = this.model;
    var empid = req.params.id;
    var projects = projectsmodel;
    var _idstatus = mongoose.Types.ObjectId.isValid(empid);
    if (_idstatus == false) {
        var resData = {};
        var err = empid + 'Employee Id is invalid';
        resData['error'] = err;
        res.send(resData);
    }
    else{
        var employee_id = mongoose.Types.ObjectId(empid);
         model.find({ "_id": employee_id }, function (err, data) {
                  if(err){
                    var resData = {};
                    resData['error'] = err;
                    res.send(resData);
                  }
                  else if (data && data.length > 0) {
                    Followers.find({ "email": data[0]._doc.email }, function (err, data1) {                 
                      var resData = {};
                      var dt = {};
                      dt['name'] = data[0]._doc.name;
                      dt['act_status'] = data[0]._doc.act_status;
                      dt['email'] = data[0]._doc.email;
                      dt['address'] = data[0]._doc.address;   
                      dt['type'] = data[0]._doc.type; 
                      var projectcount = 0;
                      var projectslength = data1.length ? data1.length : 0;
                      var tempprojects = {projects: []};                                              
                      async.forEach(data1, function (follower, callback) {
                        var tempactivities = {activities: []};
                        var project = {}
                                if(follower._doc.project_id != null && follower._doc.project_id != "" && follower._doc.project_id != undefined){   
                                      var project_id = mongoose.Types.ObjectId(follower._doc.project_id);
                                         projects.find({ "_id": project_id }, function (err, data2) {
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
                                                            tempprojects.projects.push(project); 
                                                            callback();                                                            
                                                          }
                                                      });
                                                  } 
                                                  else{
                                                    tempprojects.projects.push(project);
                                                    callback();                                                      
                                                  }
                                            })
                                       
                                     }
                                     else{
                                      callback();
                                     }
                               })

                            }  
                            else{
                              callback();
                            }
                            projectcount = projectcount + 1;
                          
                            
                          }, function (err, cb) {
                            var result = {};
                              if(projectcount >= projectslength){
                                dt["projects"] = tempprojects.projects;
                                var resData = {};
                                resData['details'] = dt;
                                res.send(resData);
                              }  
                            return;
                        });
                        
                    
                    })
                  }
                  else{
                    var resData = {};
                    resData['details'] = null;
                    res.send(resData);
                  }
       });
    }
};


/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : getEmployeeDetailsByEmail
  @desc : Get employee details by Email.
  */
getEmployeeDetailsByEmail = (req, res) => {   
  var model = this.model;
  var empid = req.params.id;
  var projects = projectsmodel;
  var empemail = req.body.reqData.email;  
  model.find({ "email": empemail }, function (err, data) {
                if(err){
                  var resData = {};
                  resData['error'] = err;
                  res.send(resData);
                }
                else if (data && data.length > 0) {
                  Followers.find({ "email": data[0]._doc.email }, function (err, data1) {                 
                    var resData = {};
                    var dt = {};
                    dt['name'] = data[0]._doc.name;
                    dt['act_status'] = data[0]._doc.act_status;
                    dt['email'] = data[0]._doc.email;
                    dt['address'] = data[0]._doc.address;   
                    dt['type'] = data[0]._doc.type; 
                    var projectcount = 0;
                    var projectslength = data1.length ? data1.length : 0;
                    var tempprojects = {projects: []};                                              
                    async.forEach(data1, function (follower, callback) {
                      var tempactivities = {activities: []};
                      var project = {}
                              if(follower._doc.project_id != null && follower._doc.project_id != "" && follower._doc.project_id != undefined){   
                                    var project_id = mongoose.Types.ObjectId(follower._doc.project_id);
                                       projects.find({ "_id": project_id }, function (err, data2) {
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
                                                          tempprojects.projects.push(project); 
                                                          callback();                                                            
                                                        }
                                                    });
                                                } 
                                                else{
                                                  tempprojects.projects.push(project);
                                                  callback();                                                      
                                                }
                                          })
                                     
                                   }
                                   else{
                                    callback();
                                   }
                             })

                          }  
                          else{
                            callback();
                          }
                          projectcount = projectcount + 1;
                        
                          
                        }, function (err, cb) {
                          var result = {};
                            if(projectcount >= projectslength){
                              dt["projects"] = tempprojects.projects;
                              var resData = {};
                              resData['details'] = dt;
                              res.send(resData);
                            }  
                          return;
                      });
                      
                  
                  })
                }
                else{
                  var resData = {};
                  resData['details'] = null;
                  res.send(resData);
                }
   });
  
};

success = (req, res) => {  
 console.log("Success");
}
  


failure = (req, res) => {  
  console.log("failure");
 }
   


}