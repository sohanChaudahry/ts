import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ToastComponent } from '../shared/toast/toast.component';


import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';

@Injectable()
export class RecursiveService {

  constructor(private router: Router,
              private userService: UserService,
              private authService:AuthService,
              private taskService : TaskService,              
              public toast:ToastComponent) {
       
  }

  checkUserLogedIn(){
    //Vaibhav Mali. 27 Dec 2017 ...Updated.
    // Vaibhav Mali 06 Jan 2018 ...Start
    //this.authService.getLogedinUserData();
    let me=this;
    this.authService.getLogedinUserData(function() {
        var current_status = localStorage.getItem("login_status");    
        if(!current_status){
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
                           //reqData._id = _id;
                           this.userService.emplogout(Id).subscribe(
                            res => { 
                                    localStorage.clear();
                                    this.router.navigate(['/login']);
                            })
                       //  return;
                      }
                 )
            }
            else{
              this.userService.emplogout(Id).subscribe(
                res => { 
                        localStorage.clear();
                        this.router.navigate(['/login']);
                })
            } 
        }
        else{
           me.getProjectRequests();    
           me.getAccept_or_cancel_ProjectRequests(); 
           var _id = localStorage.getItem("_id"); 
           me.getNewTasks(_id);
        } 
        setTimeout(function() {
            me.checkUserLogedIn();
        }, 60*60*5);
    })
    // Vaibhav Mali 06 Jan 2018 ...End
   
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
        });
      }


         /*
     @author : Vaibhav Mali 
     @date : 09 Jan 2018
     @API : getNewTasks
     @desc : To get new tasks.
   */
    getNewTasks(_id){
      this.userService.getnewTasks(_id).subscribe(
        res => {
          var current_status = localStorage.getItem("login_status");
          if(current_status){
            var messages = "";
            if(res && res.tasks.length > 0 ){
               for (let task of res.tasks) {
                localStorage.setItem(task.project_id,(1).toString())       
                  if(task.read != 1)                       
                    messages = messages + '<br/>' + task.message + '<br/>';
                }
            }
            if(messages != "")
            this.toast.setMessage(messages, 'success top',4000)  
          }
        });
      }


}
