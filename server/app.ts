import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

import setRoutes from './routes';
import UtilsCtrl from './controllers/utils';

var express = require('express'); 

const app = express();

const cors = require('cors')

app.use(cors());

var followers = mongoose.model('followers');
var empmodel = mongoose.model('employees');
var user_accept = mongoose.model('user_accept');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));
// Add headers

/*app.use(function (req, res, next) {
  
  res.header("Access-Control-Allow-Origin", "*");
  // Website you wish to allow to connect
     // res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  
      // Request methods you wish to allow
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
      // Request headers you wish to allow
      //res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.header('Access-Control-Max-Age', '86400');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.header('Access-Control-Allow-Credentials', true);
  
      // Pass to next layer of middleware
      next();
  });
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });*/

  /*app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    //res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    //intercepts OPTIONS method
    if ('OPTIONS' == req.method) {
      //respond with 200
      res.send(200);
     //res.redirect("/auth/google")
    }
    else {
    //move on
      next();
    }
});*/

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var responseHandler=require(__dirname+'/controllers/response-handler');
var requestValidator=require(__dirname+'/controllers/request-validator');

var session = require('express-session');

app.use(session({secret:'ugXQ8c107WVAH5qKXSb44xJm'}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static('./public'));


app.use(responseHandler);
app.use(requestValidator);


app.use(function (req,res,next) {
  if(req.headers.authorization){
      var token=req.headers.authorization.toString().split(' ').pop().trim();
      var utils= new UtilsCtrl();
      utils.getAccessTokenDetails(token,function (err,token) {
          if(err){
            next(err);
          }else{
            req.body.user=token.user;
              if(req.body.reqData)
              {
                req.body.reqData.user=token.user.id;
              }
             else
             {
              req.body={
                'reqData':{
                  'user':token.user.id
                }
              }
             }
              next();
          }
      })
  }else{
      next();
  }
});

passport.use(new GoogleStrategy({
  clientID: '1079197674548-mjnmiqrfh5jkdkubgvd8hg9js1ljilri.apps.googleusercontent.com',
  clientSecret:'ugXQ8c107WVAH5qKXSb44xJm',
  callbackURL:'http://localhost:3000/auth/google/callback',
 // accessType: 'offline'
}, (accessToken, refreshToken, profile, cb) => {
  // Extract the minimal profile information we need from the profile object
  // provided by Google
  //cb(null, extractProfile(profile));
  const current_date = new Date();  
  console.log(profile.id);
  console.log(profile.displayName);
  console.log(profile.emails[0].value);
  var result = {};
  var projectids = null;

  //If it is normal login with google.
    empmodel.find({ "email": profile.emails[0].value }, function (err, data1) {
      if(data1 && data1.length > 0){
        //If email already exist then update followers and active status
         empmodel.findOneAndUpdate({ "email": profile.emails[0].value}, { "$set": { "act_status": 1,"modify_date": current_date }}).exec(function (err, data2) {
            followers.findOneAndUpdate({ "email": profile.emails[0].value,"project_id":""}, { "$set": { "modify_date": current_date }}).exec(function (err, data2) {
              return cb(null,profile);
            })
         })
      }
      else{
        //If it is first time google login
        var obj = new followers();
        obj.email = profile.emails[0].value;
        obj.create_date = current_date;
        obj.modify_date = current_date;
        obj.save(function (err) {
          if (err) {
             return cb(err); 
          }
          else{
             var obj = new empmodel();
             obj.email = profile.emails[0].value;
             obj.name = profile.displayName;
             obj.act_status = 1;
             obj.create_date = current_date;
             obj.modify_date = current_date;
             obj.save(function (err) {
             if (err) {
              return cb(err);
             }
             else{
              return cb(null,profile);
             }
           })
        }
     })
    }
  })    
 }));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : $Login with google
  */
app.get('/auth/google',passport.authenticate('google',{
  scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
 // prompt : "select_account" // Added here
  
}));

app.get('/auth/google/callback', 
passport.authenticate('google', { 
  failureRedirect: '/fail'
 // prompt : "select_account" // Added here
}),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/success');
});

app.get('/success', function(req, res) {
  console.log("Login success");
  res.send("Login Success");
});  

app.get('/fail', function(req, res) {
  console.log("Login fail");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send("Login Failed");  
});  

/*
  @author : Vaibhav Mali 
  @date : 12 Dec 2017
  @API : $Logout from google
  */
app.get('/logout', function(req, res) {
  console.log("logged out!");
  if(req && req.user){
  empmodel.findOneAndUpdate({ "email": req.user.emails[0].value}, { "$set": { "act_status": 0 }}).exec(function (err, data2) {
  req.session.destroy(function (err) {
    res.redirect('https://accounts.google.com/logout');    
  });   
  })
  }
  else{
    res.redirect('http://localhost:3000/auth/google');        
  }
});


let mongodbURI;
if (process.env.NODE_ENV === 'test') {
  mongodbURI = process.env.MONGODB_TEST_URI;
} else {
  mongodbURI = process.env.MONGODB_URI;
  app.use(morgan('dev'));
}

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(mongodbURI, { useMongoClient: true });

mongodb
  .then((db) => {
    console.log('Connected to MongoDB on', db.host + ':' + db.port);

    setRoutes(app);

    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    if (!module.parent) {
      app.listen(app.get('port'), () => {
        console.log('Angular Full Stack listening on port ' + app.get('port'));
      });
    }

  })
  .catch((err) => {
    console.error(err);
});

export { app };
