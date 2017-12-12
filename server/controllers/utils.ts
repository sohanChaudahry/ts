var _ = require('underscore');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var request = require('request');
var async = require('async');
var mongoose = require('mongoose');
var module = {};
var util = module;
var nodemailer=require('nodemailer');

import UserCtrl from '../controllers/utils';
import Session from '../models/sessions';
import MailTemplateCtrl from '../mailTemplate';

export default class UtilsCtrl {
    objectId=function(id){
      return mongoose.Types.ObjectId(id);
    }
    convertToJson=function(list){
      for(var i=0;i<list.length;i++){
        list[i]=list[i].toJSON();
      }
      return list;
    }
    authourize=function(role){
      return function (req,res,next) {
        if(!(req.body.user && req.body.user.role.type=="admin")){
          res.sendError('ERR022');
        }else{
          next();
        }
      }
   }
   getAccessTokenDetails = function (token, next) {
        var util = this;
        async.waterfall([

        // function (next) {
        //     jwt.verify(token,  process.env.SECRET_TOKEN, function (err, decoded) {
        //       Session.findOne({token:token}).populate('user').exec(function (err,token) {
        //         if(err){
        //           next(err)
        //         }else if(token && token.isValidToken()){
        //           next(null,token);
        //         }else{
        //           next('ERRRO');
        //         }
        //       })

        //     })
        // }], next);

            function (next) {
                jwt.verify(token,  process.env.SECRET_TOKEN, function (err, decoded) {
                  Session.findOne({token:token}).populate('user').exec(function (err,token) {
                    if(err){
                      next(err)
                    }else if(token && token.isValidToken()){
                      next(null,token);
                    }else{
                      next('ERR021');
                    }
                  })
     })
            }], next);

    };
    

sendMail =function(user){

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'ps152@enovate-it.com',//process.env.EMAIL_USERNAME,
                pass: 'Passw0rd'//process.env.EMAIL_PASSWORD
            }
        });
        var mailTemplateCtrl=new MailTemplateCtrl();
        var messageText=mailTemplateCtrl.USER_MAIL_TEMPLATE;
        messageText.replace(/#USERNAME#/g,user.get('username'));
        messageText.replace(/#PASSWARD#/g,user.get('password'));
        var mailOptions = {
                from: 'ps152@enovate-it.com',
                to: user.get('email'),
                subject: 'USER DETAILS',
                text: messageText,
                //html:messageText,

            };
            transporter.sendMail(mailOptions, function(err) {
                console.log('Failed to send Mail:-'+user.get('email'));
            });
  } 


}
