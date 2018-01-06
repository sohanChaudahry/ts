import user_accept from '../models/user_accept';
import followers from '../models/followers';
var async = require("async");
var moment=require("moment");
var fs=require("fs");
const mongoose = require('mongoose');
var Followers = mongoose.model('followers');
var User_accept = mongoose.model('user_accept');
var empmodel = mongoose.model('employees');
const nodemailer = require('nodemailer');
var projects = mongoose.model('projects');
export default class UserAcceptCtrl  {
  model = user_accept;


  /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : request_join
  @desc : Send request to join projects or join invoice status.
  */
  request_join = (req, callback) => {
    var model = User_accept;
    var me =this;
   // var req_data = req.body.reqData;
    var req_data = req;    
    req_data.to_email = "vaibhavmali376@gmail.com"
    const current_date = new Date();
    var tempfrom = "";
    var tempto = "";
    var result = {};
    var flag = 0;
    var message;
    empmodel.find({ "email": req_data.from_email }, function (err, data) {  
          if(data && data.length > 0){
                //It is request to join projects.
              var project_id = mongoose.Types.ObjectId(req_data.project_id);
              projects.find({ "_id": project_id}, function (err, data4) {
                 if(data4 && data4.length > 0){
                    user_accept.find({ "from_email": req_data.from_email,"to_email": req_data.to_email,"project_id": req_data.project_id,"accept" : 0 }, function (err, data3) {
                      if(data3 && data3.length > 0){
                        user_accept.findOneAndUpdate({  "to_email": req_data.to_email,"project_id": req_data.project_id,"accept" : 0 }, { "$set": { "role" : req_data.role }}).exec(function (err, data2) {
                            //Request is already there.
                            result['error'] = "Your request is already there please wait to accept";
                            callback(null,result)
                        })
                      }
                      else{
                           empmodel.find({ "email": req_data.to_email}, function (err, data2){  
                                  var obj = new model();
                                  obj.from_email = req_data.from_email;
                                  obj.to_email = req_data.to_email;
                                  obj.project_id = req_data.project_id;
                                  obj.role = req_data.role;    
                                  obj.create_date = current_date;     
                                  obj.modify_date = current_date;                         
                                  obj.save(function (err) {
                                   if (err){
                                       console.log("Error: " + err);
                                       result['error'] = err;
                                       callback(null,result)
                                      
                                   }
                                   else {
                                    if(data2 && data2.length > 0){
                                         if(data2[0].act_status == 1){
                                            //If user is active then please get requested projects.
                                            result['status'] = 1;
                                            callback(null,result)
                                         } 
                                         else{
                                          flag = 1;
                                          var req = {}
                                          req['from_email'] = req_data.from_email;
                                          req['to_email'] = req_data.to_email;
                                          req['message'] = data[0].name +  " has requested to join project " + data4[0].project_name; 
                                          me.sendMail(req,function cb(err,resData){
                                            callback(null,resData)
                                          })
                                      }

                                    }
                                     else{
                                      //Requested email is not registered
                                        flag = 1;
                                         var req = {}
                                        req['from_email'] = req_data.from_email;
                                        req['to_email'] = req_data.to_email;
                                        req['message'] = data[0].name +  " has requested to join project " + data4[0].project_name; 
                                        me.sendMail(req,function cb(err,resData){
                                          callback(null,resData)
                                        })
                                    
                                      }
                                   }
                                  })
                           })
                      }

                    })
                  }
                  else{
                      //Requested project is not present.
                       result['error'] = "Requested project is not present";
                       callback(null,result)
                   
                    }
                 })

          }
          else{
               result['error'] = "You are not member of status,please register first";
               callback(null,result)
             
          }
       
    }) 

  }


  sendMail = (req, cb) => { 
    var result = {};
    // Send mail with message
   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
       let transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
       port: 587,
       secure: false,// true for 465, false for other ports
      auth: {
        user: 'vm207@enovate-it.com', // generated ethereal user
         pass:'vaibaiju100'  // generated ethereal password
       }
    });

   // setup email data with unicode symbols
   let mailOptions = {
    from: 'vm207@enovate-it.com', // sender address
    to: req.to_email, // list of receivers
    subject: 'Request to Join Project', // Subject line
  //  text: req.message, // plain text body
    html: '<div><p> ' + req.message +'</p> <br> <a href = "http://localhost:3000/auth/google">Please click link to accept </a></div>' // html body
     };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      result['error'] = error;
    // return console.log(error);
       cb(null,result)
   
    }
   console.log('Message sent: %s', info.messageId);
   // Preview only available when sending through an Ethereal account
   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
   result["status"] = 2;// status = 2 means requested user is not active.
   result["message"] = "Request has been sent successfully"
   // res.send(result);
   // return result;
    cb(null,result)

    });
   })
    
}    




 /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : getprojectrequests
  @desc : Get projects requests came for user.
  */
  getprojectrequests = (req, res) => {   
    var model = this.model;
   // var email = req.body.reqData.email;
    var email ;
    var result1 = {};
    if(req && req.user){
    email = req.user.emails[0].value;
    var count = 0;
    var result = {
      requests:[]
    };
    user_accept.find({ "to_email": email,"accept" : 0,"flag":0 }, function (err, data) {
        if(data && data.length > 0){
            //If project requests are present for users.
            count = 0;
            var length = data.length ? data.length : 0;
            async.forEach(data, function (request, callback) {
            followers.find({ "email": req.user.emails[0].value,"project_id":request.project_id  }, function (err, data4) {
             if(data4 && data4.length > 0){
                 count = count + 1;
                 callback();
             }
             else{
              empmodel.find({ "email": request.from_email }, function (err, data2) {
                  var dt = {};
                  dt["employee_id"] = data2[0]._id;
                  dt["name"] = data2[0].name;
                  dt["email"] = data2[0].email;
                  var project_id = mongoose.Types.ObjectId(request.project_id);
                  projects.find({ "_id": project_id}, function (err, data3) {
                      dt["project_id"] = request.project_id;  
                      dt["project_name"] = data3[0].project_name;
                     // user_accept.findOneAndUpdate({  "to_email": email,"accept" : 0,"project_id" : request.project_id,"flag":0 }, { "$set": { "flag":1 }}).exec(function (err, data2) {
                        result.requests.push(dt);
                        count = count + 1;
                        callback();
                    //  })
                  })
              })
            }
            })
            }, function (err, cb) {
                   if(count >= length){
                       res.send(result);
                   }  
                   return;
            });
        }
        else{
            //If no any project request for user.
             res.send(result);
        } 
      })  
   }
   else{
        result1['success'] = false;
        result1['error'] = "You are not member of status please login with google first";
        res.send(result1);
    } 
  };


 /*
  @author : Vaibhav Mali 
  @date : 15 Dec 2017
  @API : getaccept_cancel_projectrequests
  @desc : Get accepted and canceled our projects requests from someone.
  */
  getaccept_cancel_projectrequests = (req, res) => {   
    var model = this.model;
   // var email = req.body.reqData.email;
    var email ;
    var result1 = {};
    if(req && req.user){
    email = req.user.emails[0].value;
    var count = 0;
    var result = {
      accepts:[],
      cancels:[]
    };
  user_accept.find({ "from_email": email,"accept" : 1,"$or":[{"flag":0},{"flag": 1}] }, function (err, data) {
     user_accept.find({ "from_email": email,"accept" : -1,"$or":[{"flag":0},{"flag": 1}] }, function (err, data1) {      
        if(data && data.length > 0){
            count = 0;
            var length = data.length ? data.length : 0;
            async.forEach(data, function (request, callback) {
              empmodel.find({ "email": data[0]._doc.to_email }, function (err, data2) {
                  var dt = {};
                  dt["employee_id"] = data2[0]._id;
                  dt["name"] = data2[0].name;
                  dt["email"] = data2[0].email;
                  var project_id = mongoose.Types.ObjectId(request.project_id);
                  projects.find({ "_id": project_id}, function (err, data3) {
                      dt["project_id"] = request.project_id;  
                      dt["project_name"] = data3[0].project_name;
                      dt["message"] = data3[0].project_name + " Project accepted succssfully by " + dt["name"];
                      user_accept.findOneAndUpdate({  "from_email": email,"accept" : 1,"project_id" : project_id,"$or":[{"flag":0},{"flag": 1}]}, { "$set": { "flag":2 }}).exec(function (err, data2) {
                        result.accepts.push(dt);
                        count = count + 1;
                        callback();
                      })
                  })
              })
            }, function (err, cb) {
                   if(count >= data.length){
                    count = 0;
                    if(data1 && data1.length > 0){                      
                    var length = data1.length ? data1.length : 0;
                    async.forEach(data1, function (request, callback) {
                      empmodel.find({ "email": data1[0]._doc.to_email }, function (err, data2) {
                          var dt = {};
                          dt["employee_id"] = data2[0]._id;
                          dt["name"] = data2[0].name;
                          dt["email"] = data2[0].email;
                          var project_id = mongoose.Types.ObjectId(request.project_id);
                          projects.find({ "_id": project_id}, function (err, data3) {
                              dt["project_id"] = request.project_id;  
                              dt["project_name"] = data3[0].project_name;
                              dt["message"] = data3[0].project_name + " Project canceled by " + dt["name"];
                              user_accept.findOneAndUpdate({  "from_email": email,"accept" : -1,"project_id" : request.project_id,"$or":[{"flag":0},{"flag": 1}] }, { "$set": { "flag":2 }}).exec(function (err, data2) {
                                result.cancels.push(dt);
                                count = count + 1;
                                callback();
                              })
                          })
                      })
                      }, function (err, cb) {
                           if(count >= data1.length){
                               
                               res.send(result);
                           }  
                           return;
                       });
                      }
                      else{
                        res.send(result);
                      }
                 }  
                   return;
            });
        }
        else if (data1 && data1.length > 0){
            count = 0;
            var length = data1.length ? data1.length : 0;
            async.forEach(data1, function (request, callback) {
              empmodel.find({ "email": data1[0]._doc.to_email }, function (err, data2) {
                  var dt = {};
                  dt["employee_id"] = data2[0]._id;
                  dt["name"] = data2[0].name;
                  dt["email"] = data2[0].email;
                  var project_id = mongoose.Types.ObjectId(request.project_id);
                  projects.find({ "_id": project_id}, function (err, data3) {
                      dt["project_id"] = request.project_id;  
                      dt["project_name"] = data3[0].project_name;
                      dt["message"] = data3[0].project_name + " Project canceled by " + dt["name"];
                      user_accept.findOneAndUpdate({  "from_email": email,"accept" : -1,"project_id" : request.project_id,"$or":[{"flag":0},{"flag": 1}] }, { "$set": { "flag":2 }}).exec(function (err, data2) {
                        result.cancels.push(dt);
                        count = count + 1;
                        callback();
                      })
                    
                  })
              })
            }, function (err, cb) {
                   if(count >= data1.length){
                    count = 0;
                    if(data && data.length > 0){                      
                    var length = data.length ? data.length : 0;
                    async.forEach(data, function (request, callback) {
                      empmodel.find({ "email": data[0]._doc.to_email }, function (err, data2) {
                          var dt = {};
                          dt["employee_id"] = data2[0]._id;
                          dt["name"] = data2[0].name;
                          dt["email"] = data2[0].email;
                          var project_id = mongoose.Types.ObjectId(request.project_id);
                          projects.find({ "_id": project_id}, function (err, data3) {
                              dt["project_id"] = request.project_id;  
                              dt["project_name"] = data3[0].project_name;
                              dt["message"] = data3[0].project_name + " Project accepted succssfully by " + dt["name"];
                              user_accept.findOneAndUpdate({  "from_email": email,"accept" : 1,"project_id" : request.project_id,"$or":[{"flag":0},{"flag": 1}] }, { "$set": { "flag":2 }}).exec(function (err, data2) {
                                result.accepts.push(dt);
                                count = count + 1;
                                callback();
                              })
                          })
                      })
                      }, function (err, cb) {
                           if(count >= data.length){
                               
                               res.send(result);
                           }  
                           return;
                       });
                      }
                      else{
                        res.send(result);
                      }
                 }  
                   return;
            });
        
        }
        else{
             res.send(result);
        } 
      })  
    })
   }
   else{
        result1['success'] = false;
        result1['error'] = "You are not member of status please login with google first";
        res.send(result1);
    } 
  };



   /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : request_accept
  @desc : Accept project request by project Id.
  */
  request_accept = (req, res) => {
    var model = User_accept;
    const current_date = new Date();    
    var result = {};
    var project_id = mongoose.Types.ObjectId(req.params.id); 
    if(req && req.user){
    user_accept.find({ "to_email": req.user.emails[0].value,"project_id" : project_id,"accept":0  }, function (err, data3) {
     followers.find({ "email": req.user.emails[0].value,"project_id":project_id  }, function (err, data) {
           //Get project Id of requested mail and save it.
           if(data && data.length > 0){
              result['success'] = true;
              result['message'] = "Request accepted";
              res.send(result);
           }
           else{
           var obj = new followers();
           obj.email = req.user.emails[0].value;
           obj.project_id = req.params.id;
           obj.role = data3[0]._doc.role;           
           obj.create_date = current_date;
           obj.modify_date = current_date;
           obj.save(function (err) {
              if (err) {
                result['success'] = false;
                result['error'] = err;
                res.send(result);              
             }
             else{
                 empmodel.find({ "email": req.user.emails[0].value }, function (err, data1) {
                   if(data1 && data1.length > 0){
                     empmodel.findOneAndUpdate({ "email": req.user.emails[0].value}, { "$set": { "act_status": 1,"modify_date": current_date }}).exec(function (err, data8) {
                             user_accept.findOneAndUpdate({ "to_email": req.user.emails[0].value,"project_id" : project_id}, { "$set": { "accept":1}}).exec(function (err, data2) {  
                                 result['success'] = true;
                                 result['message'] = "Request accepted";
                                 res.send(result);
                       })
 
                   })
                 } 
                 else{
                     result['success'] = false;
                     result['error'] = "You are not member of status please login with google first";
                     res.send(result);
                 }
                })  
             }
         })  
 
        }
            
      }) 
    })
    }
    else{
        result['success'] = false;
        result['error'] = "User is not logged in please login with google and continue"
        res.send(result);
    }
 }
  

   /*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : request_cancel
  @desc : Cancel project request by project Id.
  */
 request_cancel = (req, res) => {
    var model = User_accept;
    var result = {};    
    var project_id = mongoose.Types.ObjectId(req.params.id); 
    if(req && req.user){
       user_accept.findOneAndUpdate({ "to_email": req.user.emails[0].value,"project_id" : project_id}, { "$set": { "accept":-1}}).exec(function (err, data) {  
       if(err){
         result['success'] = false;
         result['error'] = err;
         res.send(result);
       }
       else{
         result['success'] = true;
         result['message'] = "Request Cancelled";
         res.send(result);
       }
       })
    }
    else{
        result['success'] = false;
        result['error'] = "User is not logged in please login with google and continue"
        res.send(result);
    }
 }


  /*
  @author : Vaibhav Mali 
  @date : 26 Dec 2017
  @API : updateProjectRequestStatus
  @desc :Update Project request flag of current logged in user.
  */
  updateProjectRequestStatus = (req, res) => {
    var model = User_accept;
    var result = {};        
    if(req && req.user){
        user_accept.update({  "to_email": req.user.emails[0].value,"accept" : 0,"flag":0 }, { "$set": { "flag":1 }},{multi:true}).exec(function (err, data) {
          result['success'] = true; 
          res.send(result);          
        })
    }
    else{
      result['success'] = false;
      result['error'] = "User is not logged in please login with google and continue"
      res.send(result);
    }
  }

}