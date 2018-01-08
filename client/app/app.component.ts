import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RecursiveService } from './services/recursive.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import {Observable} from 'rxjs/Rx';
import { Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public auth: AuthService,
  private recursiveService :RecursiveService,
  private taskService : TaskService,
  private userService: UserService,  
  private router : Router) { 

  }
  ngOnInit() {
    var count = 0;
    localStorage.setItem("project_requests",count.toString())   
    this.auth.getLogedinUserData();
    this.recursiveService.checkUserLogedIn();
    if (this.auth.loggedIn) {
      this.router.navigate(['/home']);
    }
    this.router.events.subscribe(event => {
      if(!this.auth.loggedIn) {
          if(!this.check_login_status) {
              this.router.navigate(['login']);
          } 
      }
    });
  }
  // Vaibhav Mali 06 Jan 2018 ...Start
  logout(){
    var  AssignedtaskFormDetail = {
      _id:"",
      select:0,
      status:0,
      spendtime : {}
    };
    var Id = localStorage.getItem("_id");    
    var  reqData = {
      _id:""
    };
    var select = localStorage.getItem("select");
    if(parseInt(select) == 1){
           AssignedtaskFormDetail.select = 0;
           AssignedtaskFormDetail.status = 1;
           AssignedtaskFormDetail.spendtime['start_date_time'] = localStorage.getItem('spend_start_date_time');  
           AssignedtaskFormDetail.spendtime['end_date_time'] = new Date();  
           AssignedtaskFormDetail.spendtime['actual_hrs'] = parseFloat(localStorage.getItem("actual_hrs"));
           AssignedtaskFormDetail.spendtime['comment'] = "User logged out";
           AssignedtaskFormDetail._id = localStorage.getItem('task_id');  
           this.taskService.saveTaskDetail({reqData:[AssignedtaskFormDetail]}).subscribe(
            res => { 
           //      reqData._id = _id;
                 this.userService.emplogout(Id).subscribe(
                  res => { 
                      localStorage.clear();
                      window.location.href='http://localhost:3000/logout';                      
                  })
                }
           )
    }
    else{
      this.userService.emplogout(Id).subscribe(
        res => { 
            localStorage.clear();
            window.location.href='http://localhost:3000/logout';                      
        })      
    }
  
  }
   // Vaibhav Mali 06 Jan 2018 ...End
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
