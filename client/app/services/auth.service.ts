import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;
  jwtHelper: JwtHelper = new JwtHelper();
  current_user_name="";
  constructor(private userService: UserService,
              private router: Router) {
       
  }
  login_google() {
     return this.userService.loginGoogle().map(
        res => {
          return res;
        }
      );
  }

  public checkIsLogin=0;

  getLogedinUserData(cb? :any) {
     this.userService.getLogedinUser().subscribe(
      res => {
        if(res && res.login_status){
            this.current_user_name=res.name;
            localStorage.setItem('_id', res._id);
            localStorage.setItem('name', res.name);
            localStorage.setItem('login_status', res.login_status); 
            localStorage.setItem('email', res.email);
            this.checkIsLogin=res.login_status;
            // console.log(res);
        }else{
            localStorage.clear();
        }
        if(cb && typeof cb=="function"){
           cb();
        }
      }
    );
  }
}
