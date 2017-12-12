import Followers from '../models/followers';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');
export default class FollowersCtrl  {

  model = Followers;

}