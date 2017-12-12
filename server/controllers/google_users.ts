import google_users from '../models/google_users';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


export default class UsersCtrl  {

  model = google_users;

  user_google_login = (req, res) => {
    var google_user = req.body.reqData;
    var userId = google_user.user_id;
    var password = google_user.password;
    var model = this.model;
      
    
    
  }


  

}