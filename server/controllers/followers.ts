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
    var project_id = mongoose.Types.ObjectId(projects.project_id);
    
    var resData = {};  
    Followers.remove({ project_id: project_id,email:projects.email }, function(err) {
      if (err) {
        resData["error"] = err;
        res.send(resData);
      }
      else{
        user_accept.remove({ project_id: project_id,to_email:projects.email }, function(err) {
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
  
  deleteProjectByProjectId = (req, res) => {  
    var projectid = req.params.id;    
    var project_id = mongoose.Types.ObjectId(projectid);
    var resData = {};  
    Followers.remove({ project_id: project_id}, function(err) {
      if (err) {
        resData["error"] = err;
        res.send(resData);
      }
      else{
        user_accept.remove({ project_id: project_id }, function(err) {
           if(err){
               resData["error"] = err;
               res.send(resData);
           }
           else{
                Projects.remove({ _id: project_id }, function(err) {
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
    })
  }




}