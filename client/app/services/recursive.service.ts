import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ToastComponent } from '../shared/toast/toast.component';


import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RecursiveService {

  constructor(private router: Router,
              private userService: UserService,
              private authService:AuthService,
              public toast:ToastComponent) {
       
  }

  checkUserLogedIn(){
    //Vaibhav Mali. 27 Dec 2017 ...Updated.
    //this.authService.getLogedinUserData();
    let me=this;
    this.authService.getLogedinUserData(function() {
        var current_status = localStorage.getItem("login_status");    
        if(!current_status){
            this.router.navigate(['/login']);
            return;
        }
        else{
           me.getProjectRequests();    
           me.getAccept_or_cancel_ProjectRequests(); 
        } 
        setTimeout(function() {
            me.checkUserLogedIn();
       
        }, 60*60*3);
    })
   
 }

  
 /*
  @author : Vaibhav Mali 
  @date : 27 Dec 2017
  @API : getProjectRequests
  @desc : Get new project requests.
  */
  getProjectRequests(){
    this.userService.getnewProjectRequests().subscribe(
      res => {
        var current_status = localStorage.getItem("login_status");
        if(current_status){
          if(res && res.requests.length > 0){
           var project_requests = localStorage.getItem("project_requests");           
           if(parseInt(project_requests) <  res.requests.length){
             localStorage.setItem("project_requests",res.requests.length)
             this.toast.setMessage(res.requests.length +" New project requests", 'success top',4000)
           }
          }
          else{
            var count = 0;
            localStorage.setItem("project_requests",count.toString())            
          }
        }
      });
    }

    
   /*
     @author : Vaibhav Mali 
     @date : 27 Dec 2017
     @API : UpdateProjectRequestFlag
     @desc : Update flag of project requests.
   */
    UpdateProjectRequestFlag(){
      this.userService.UpdateProjectRequestsStatus().subscribe(
        res => {
          var current_status = localStorage.getItem("login_status");
          if(current_status){
            var count = 0;
            localStorage.setItem("project_requests",count.toString()); 
          }
        });
      }

     /*
     @author : Vaibhav Mali 
     @date : 27 Dec 2017
     @API : getAccept_or_cancel_ProjectRequests
     @desc : To get new accepted or canceled our project requests.
   */
    getAccept_or_cancel_ProjectRequests(){
      this.userService.get_Accept_Cancel_ProjectRequests().subscribe(
        res => {
          var current_status = localStorage.getItem("login_status");
          if(current_status){
            var messages = "";
            if(res && res.accepts.length > 0 ){
               for (let accept of res.accepts) {
                 messages = messages + '<br/>' + accept.message + '<br/>';
                }
            }
            if(res && res.cancels.length > 0){
              for (let cancel of res.cancels) {
                messages = messages + '<br/>' + cancel.message + '<br/>';                
               }
            }
            this.toast.setMessage(messages, 'success top',4000)  
          }
          console.log(res);
        });
      }

}
