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
  getLogedinUserData() {
     this.userService.getLogedinUser().subscribe(
      res => {
        localStorage.setItem('_id', res._id);
        localStorage.setItem('name', res.name);
        localStorage.setItem('login_status', res.login_status); 
        localStorage.setItem('email', res.email);
        console.log(res);
      }
    );
  }
}
