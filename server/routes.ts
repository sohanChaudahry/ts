import * as express from 'express';
import User from './models/user';
import ActivitiesCtrl from './models/activities';
 import EmployeesCtrl from './controllers/employees';
 import FollowersCtrl from './controllers/followers';
 import ProjectsCtrl from './controllers/projects';
 import TasksCtrl from './controllers/tasks';
 import TaskTimeCtrl from './controllers/tasktime'; 
 import UtilsCtrl from './controllers/utils'; 
 import UserCtrl from './controllers/user';
 import UserAcceptCtrl from './controllers/user_accept';
 
 
export default function setRoutes(app) {

 // var express = require('express');   
  const router = express.Router();
  const passport = require('passport');
  const GoogleStrategy = require('passport-google-oauth20').Strategy;

  const userCtrl = new UserCtrl();

  const employeesCtrl = new EmployeesCtrl();
  const followersCtrl = new FollowersCtrl();
  const projectsCtrl = new ProjectsCtrl();
  const activitiesCtrl = new ActivitiesCtrl();
  const tasksCtrl = new TasksCtrl();
  const taskstimeCtrl = new TaskTimeCtrl();  
  const Util = new UtilsCtrl();
  const userAcceptCtrl = new UserAcceptCtrl();
  
  // Users
  router.route('/login').post(userCtrl.login);
  //router.route('/users/resetPassword').post(userCtrl.resetPassword);  
  router.route('/users').get(userCtrl.getAll);
 // router.route('/users').get(Util.authourize('ADMIN'),userCtrl.getAll);
  router.route('/users/count').get(Util.authourize('ADMIN'),userCtrl.count);
  router.route('/user/create').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/update/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Projects
  router.route('/projects/save').post(projectsCtrl.save_update_projects);
  router.route('/projects/getdetails/:id').get(projectsCtrl.getProjectDetails); 
    

  //Employees
  router.route('/employees/save_update_Employees').post(employeesCtrl.save_update_Employees);
  router.route('/employees/getdetailsById/:id').get(employeesCtrl.getEmployeeDetails); 
  router.route('/employees/getdetailsByEmail').post(employeesCtrl.getEmployeeDetailsByEmail); 
  router.route('/employees/getrequestedProjects').get(employeesCtrl.getRequestDetails);   
  router.route('/employees/getAllEmployeeDetails/').get(employeesCtrl.getAllEmployeeDetails); 
  router.route('/employees/getCurrentLoginDetails/').get(employeesCtrl.getCurrentLoginDetails); 
  

  //Tasks
  router.route('/tasks/save_update_Tasks').post(tasksCtrl.save_update_Tasks);
  router.route('/tasks/getdetails/:id').get(tasksCtrl.getTaskDetails); 
  router.route('/tasks/getDetailsByAssignFrom/:id').get(tasksCtrl.getTaskDetailsByAssignFrom);
  router.route('/tasks/getDetailsByAssignTo/:id').get(tasksCtrl.getTaskDetailsByAssignTo); 
  
  
  

 //Request to join
 router.route('/employees/request/join').post(userAcceptCtrl.request_join); 
 router.route('/employees/request/getprojectrequests').get(userAcceptCtrl.getprojectrequests);
 router.route('/employees/request/getAccept_Cancel_Projectrequests').get(userAcceptCtrl.getaccept_cancel_projectrequests); 
 router.route('/employees/request/accept/:id').get(userAcceptCtrl.request_accept); 
 router.route('/employees/request/cancel/:id').get(userAcceptCtrl.request_cancel); 
 
//Followers 
router.route('/followers/delete').post(followersCtrl.deleteFollowerByprojectId); 

 
/*
  passport.use(new GoogleStrategy({
    clientID: '1079197674548-fj3r0o8v23pkg6v22itao1n5ncmeod5c.apps.googleusercontent.com',
    clientSecret:'3-nFn8QTeWdTBJKYeGXSVVSi',
    callbackURL:'http://localhost:3000/auth/google/callback',
    accessType: 'offline'
  }, (accessToken, refreshToken, profile, cb) => {
    // Extract the minimal profile information we need from the profile object
    // provided by Google
    //cb(null, extractProfile(profile));
    console.log(profile)
  }));

  router.route('/auth/google').get(
    passport.authenticate('google',
    { scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'})
   );
  
   router.route('/auth/google/callback').get(
    passport.authenticate('google', {
      successRedirect: '/success',
      failureRedirect: '/failure'
  }));


  router.route('/success/').get(employeesCtrl.success); 
  router.route('/failure/').get(employeesCtrl.failure); 
  */


  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
