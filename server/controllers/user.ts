import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import Session from '../models/sessions';
import BaseCtrl from './base';
import UtilsCtrl from '../controllers/utils';

var async = require("async");
var moment=require("moment");

export default class UserCtrl extends BaseCtrl {
  model = User;

  //login
  login = (req, res) => {
    var model=this.model;
    async.waterfall([
      function(callback){
            //
            if(req.validate([
              {
                type: 'STRING',
                field: "username",
                isRequired: true
              },
              {
                type: 'PASSWORD',
                field: "password",
                isRequired: true
              }
        ])){
           //
        model.findOne({ email: req.body.reqData.username }, (err, user) => {
          if (!user) { return res.sendError(); }
          user.comparePassword(req.body.reqData.password, (error, isMatch) => {

            if (!isMatch) {
              return res.sendError();
            }
            const expiry = new Date();
            expiry.setDate(Number(expiry.getDate()) + 60);
            const payload = {
              expiry: expiry.getTime(),
              ctime: new Date().getTime(),
              user: user.id
            };
            const token = jwt.sign(payload, process.env.SECRET_TOKEN);
            let session = new Session({token:token,expiry:expiry, user: user});
            session.save(function () {
              res.sendData(session);
            })
          });
        });
      }else{
        return  res.sendError();
      }
      }
],function(){});
  }

    // Insert users
    insert  = (req, res) => {
      var model=this.model;
      async.waterfall([
        function(callback){
              //
              if(req.validate([
                {
                  type: 'STRING',
                  field: "username",
                  isRequired: true
                },
                {
                  type: 'PASSWORD',
                  field: "password",
                  isRequired: true
                },
                 {
                  type: 'MOBILE',
                  field: "phone",
                  isRequired: true
                },
                {
                  type: 'EMAIL',
                  field: "email",
                  isRequired: true
                },
                {
                  type: 'OBJECT',
                  field: "role",
                  items:[{type: 'STRING',
                  field: "type",isRequired: true}]
                }
          ]))
          {
              const obj = new model(req.body.reqData);
              obj.save((err, item) => {
                // 11000 is the code for duplicate key error
                if (err && err.code === 11000) {
                  //res.sendStatus(400);
                  res.sendError('ERR008');
                }
                if (err) {
                  return console.error(err);
                }
                else
                {
                //  var util=new UtilsCtrl();
                //  util.sendMail(req.body.reqData)
                 res.sendData(item);
                }
              

              });
           }
        else{
          return  res.sendError();
        }
        }
  ],function(){});
    }

    // Get all activities
    getById = function (req, next) {
      var model=this.model;
      model.find( { _id: req } , (err, docs) => {
        if (err)
          {
              next(err);
          }
          else
          {
            next(null,docs);
          }
      });
    };

  



}
