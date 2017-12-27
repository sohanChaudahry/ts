import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RecursiveService } from './services/recursive.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public auth: AuthService,
  private recursiveService :RecursiveService) { 

  }
  ngOnInit() {
    var count = 0;
    localStorage.setItem("project_requests",count.toString())   
    this.auth.getLogedinUserData();
    this.recursiveService.checkUserLogedIn();
   // this.recursiveService.getProjectRequests();    
  }
  logout(){
    window.location.href='http://localhost:3000/logout';
    localStorage.clear();
  }
   /*
     @author : Vaibhav Mali 
     @date : 27 Dec 2017
     @API : check_project_requests,check_login_status
     @desc : To check new project requests and current login status.
   */
  check_project_requests(){
    var project_requests = localStorage.getItem("project_requests");
    if(parseInt(project_requests) > 0)
      return 1;
    else
      return 0;
  }
  check_login_status(){
    var login_status = localStorage.getItem("login_status");
    if(parseInt(login_status) == 1)
      return 1;
    else
      return 0;
  }
}
