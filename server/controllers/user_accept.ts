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
  request_join = (req, res) => {
    var model = User_accept;
    var req_data = req.body.reqData;
    const current_date = new Date();
    var tempfrom = "";
    var tempto = "";
    var result = {};
    var flag = 0;
    var message;
    empmodel.find({ "email": req_data.from_email }, function (err, data) {  
          if(data && data.length > 0){
                if(req_data && (req_data.project_id != "" && req_data.project_id != null && req_data.project_id != undefined)){
                //It is request to join projects.
              var project_id = mongoose.Types.ObjectId(req_data.project_id);
              projects.find({ "_id": project_id}, function (err, data4) {
                   if(data4 && data4.length > 0){
                  user_accept.find({ "from_email": req_data.from_email,"to_email": req_data.to_email,"project_id": req_data.project_id,"accept" : 0 }, function (err, data3) {
                      if(data3 && data3.length > 0){
                         //Request is already there.
                           result['error'] = "Your request is already there please wait to accept";
                          res.send(result);
                      }
                      else{
                           empmodel.find({ "email": req_data.to_email}, function (err, data2){  
                              if(data2 && data2.length > 0){
                                  var obj = new model();
                                  obj.from_email = req_data.from_email;
                                  obj.to_email = req_data.to_email;
                                  obj.project_id = req_data.project_id;
                                  obj.save(function (err) {
                                   if (err){
                                       console.log("Error: " + err);
                                       result['error'] = err;
                                   }
                                   else {
                                         if(data2[0].act_status == 1){
                                            //If user is active then please get requested projects.
                                            result['status'] = 1;
                                         } 
                                         else{
                                            // Send mail with message
                                             flag = 1;
                                             message = data[0].name +  "has requested to join project " + data4[0].project_name;
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
                                             to: req_data.to_email, // list of receivers
                                            subject: 'Request to Join', // Subject line
                                            text: message, // plain text body
                                           html: '<a href = "http://localhost:3000/auth/google">Please click link to accept </a>' // html body
                                            };
                                          // send mail with defined transport object
                                         transporter.sendMail(mailOptions, (error, info) => {
                                          if (error) {
                                            return console.log(error);
                                          }
                                          console.log('Message sent: %s', info.messageId);
                                          // Preview only available when sending through an Ethereal account
                                          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                          result["status"] = 2;// status = 2 means requested user is not active.
                                          result["message"] = "Request has been sent successfully"
                                          res.send(result);
                                          });
                                          })
                                      }
                                   }
                                  })
                              }
                              else{
                                  //Requested email is not registered
                                  result['error'] = "Requested email is not registered please request to join invoice status first";
                                  res.send(result);
                              }
                           })
                      }

                    })
                  }
                  else{
                      //Requested project is not present.
                      result['error'] = "Requested project is not present";
                      res.send(result);
                  }
                 })

                }
                else{
                         //It is request to join invoice status.
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
                          to: req_data.to_email, // list of receivers
                          subject: 'Request to connect status', // Subject line
                          text: req_data.from_email + 'has sent request to join invoice status', // plain text body
                          html: '<a href = "http://localhost:3000/auth/google">Please click link to accept </a>' // html body
                         
                        };
    
                     // send mail with defined transport object
                      transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                         console.log('Message sent: %s', info.messageId);
                         // Preview only available when sending through an Ethereal account
                         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                         result["status"] = true;
                         result["message"] = "Request has been sent successfully"
                         res.send(result);      
                        });
                     }); 
                }

          }
          else{
               result['error'] = "You are not member of status,please register first";
               res.send(result);
          }
       
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
    user_accept.find({ "to_email": email,"accept" : 0 }, function (err, data) {
        if(data && data.length > 0){
            //If project requests are present for users.
            count = 0;
            var length = data.length ? data.length : 0;
            async.forEach(data, function (request, callback) {
              empmodel.find({ "email": request.from_email }, function (err, data2) {
                  var dt = {};
                  dt["employee_id"] = data2[0]._id;
                  dt["name"] = data2[0].name;
                  dt["email"] = data2[0].email;
                  var project_id = mongoose.Types.ObjectId(request.project_id);
                  projects.find({ "_id": project_id}, function (err, data3) {
                      dt["project_id"] = request.project_id;  
                      dt["project_name"] = data3[0].project_name;
                      result.requests.push(dt);
                      count = count + 1;
                      callback();
                  })
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

}