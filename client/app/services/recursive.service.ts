import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RecursiveService {

  constructor(private userService: UserService,
              private router: Router,
              private authService:AuthService) {
       
  }
  
  checkUserLogedIn(){
      
    if(!localStorage.getItem("login_status")){
        this.router.navigate(['/login']);
        return;
    }
    let me=this;
    this.authService.getLogedinUserData(function() {
        setTimeout(function() {
            me.checkUserLogedIn();
        }, 60*60*3);
    });
  }
}
