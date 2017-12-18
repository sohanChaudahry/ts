import Followers from '../models/followers';
import user_accept from '../models/user_accept';
import Projects from '../models/projects';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
export default class FollowersCtrl  {

  model = Followers;


  /*
  @author : Vaibhav Mali 
  @date : 18 Dec 2017
  @API : deleteFollowerByprojectId
  @desc : Deleting follower from project.
  */
  deleteFollowerByprojectId = (req, res) => {  
    var projects = req.body.reqData;  
    var resData = {};  
    Followers.remove({ project_id: projects.project_id,email:projects.email }, function(err) {
      if (err) {
        resData["error"] = err;
        res.send(resData);
      }
      else{
        user_accept.remove({ project_id: projects.project_id,to_email:projects.email }, function(err) {
           if(err){
               resData["error"] = err;
               res.send(resData);
           }
           else{
               resData["success"] = true;
               res.send(resData);
           }
        })
      }
    })
  } 

}