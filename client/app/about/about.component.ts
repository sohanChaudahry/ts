import { Component, OnInit , ViewChild } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { HomeService } from '../services/home.service';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import {Popup} from 'ng2-opd-popup';



import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']

})
export class AboutComponent implements OnInit{

  //Vaibhav Mali 09 Jan 2018 ...Start

  @ViewChild('popup3') popup3: Popup;  
  timer;
  ticks = 0;
  init = 0;
  selectvalue = 0;
  task_id = "";
  paused = 0;  
  checkCommnetAssign=null;  
  selectedTaskDetail={};  
  hoursDisplay: number = localStorage.getItem("hoursDisplay") ? parseInt(localStorage.getItem("hoursDisplay")) : 0;    
  minutesDisplay: number = localStorage.getItem("minutesDisplay") ? parseInt(localStorage.getItem("minutesDisplay")) : 0;    
  secondsDisplay: number = localStorage.getItem("secondsDisplay") ? parseInt(localStorage.getItem("secondsDisplay")) : 0;    
  AssignedtaskFormDetail = {
    _id:"",
    select:0,
    status:0,
    spendtime : {}
 };
 spendtime = {
    start_date_time : new Date(),
    end_date_time : new Date(),
    actual_hrs : 0,
    comment : ""
  }
  comment_data="";
  
  //Vaibhav Mali 09 Jan 2018 ...End

  selected_project_detail={};
  isShowproject=true;
  isShowList=false;
  employeeDetail = {};
  myProjectList=[];
  AcceptedProjectList=[];
  RequestedProjectList=[];
  projectList=[];
  allTask=[];
  upcomingTasksList=[];
  pendingTasksList=[];
  completedTasksList=[];
  inProgressTaskList=[];

  checkRequestedFlag=false;
  selectedProjectId="";
  isActiveMyProject=true;
  isActiveAcceptProject=false;
  isActiveReqProject=false;
  isTaskActive=[true,false,false,false,false];
  taskList=[];
  constructor(public toast: ToastComponent,
  private homeService:HomeService,
  private auth:AuthService,
  private projectService:ProjectService,
  private taskService : TaskService) { }
  task_pagination={
    page:1,
    itemsPerPage:10,
    maxSize:5,
    numPages:5,
    length:0
  }
  project_pagination={
    page:1,
    itemsPerPage:10,
    maxSize:5,
    numPages:5,
    length:0
  }
  ngOnInit() {
    this.setTimerValue();    
    this.auth.getLogedinUserData();
    setTimeout(()=>{    
      this.openMyProject();
    },50);
       //Vaibhav Mali 09 Jan 2018 ...Start
        this.selectvalue = localStorage.getItem("select") ? parseInt( localStorage.getItem("select")) : 0;      
        if(parseInt(this.selectvalue.toString()) == 1){
        this.AssignedtaskFormDetail._id = localStorage.getItem("task_id").toString();
        this.AssignedtaskFormDetail.select = 1;
        this.ticks = this.secondsDisplay;
        this.setTimerValue()
        this.startTimer(0);
      }
      //Vaibhav Mali 09 Jan 2018 ...End
  }

  //Vaibhav Mali 09 Jan 2018 ...Start
    /*
  @author : Vaibhav Mali 
  @date : 09 Jan 2018
  @fn : startTimer,UpdateAssignedTaskDetail,startTaskFun,
        pauseTaskFun,finishTaskFun,setTimerValue,showGetComment,conformGetComent,cancelGetComent.
  */

  showGetComment(task_detail){
    this.comment_data="";
    this.selectedTaskDetail=task_detail;
    this.popup3.options = {
        header: "Comment",
        widthProsentage: 40, // The with of the popou measured by browser width 
        animationDuration: 1, // in seconds, 0 = no animation 
        showButtons: true, // You can hide this in case you want to use custom buttons 
        confirmBtnContent: "OK", // The text on your confirm button 
        cancleBtnContent: "Cancel", // the text on your cancel button 
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button 
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
    };
    this.popup3.show(this.popup3.options);
  }
  conformGetComent(){
    if(this.checkCommnetAssign=="PAUSE"){
      this.pauseTaskFun(this.selectedTaskDetail);
    }else if(this.checkCommnetAssign=="FINISH"){
      this.finishTaskFun(this.selectedTaskDetail);
    }
    this.popup3.hide();
  }
  cancelGetComent(){
    this.comment_data="";
    this.popup3.hide();
  }

  setTimerValue() { 
    var me =this; 
    this.ticks = this.secondsDisplay ? this.secondsDisplay :0;  
    this.hoursDisplay = localStorage.getItem("hoursDisplay") ? parseInt(localStorage.getItem("hoursDisplay")) : 0;      
    this.minutesDisplay = localStorage.getItem("minutesDisplay") ? parseInt(localStorage.getItem("minutesDisplay")) : 0;    
    this.secondsDisplay = localStorage.getItem("secondsDisplay") ? parseInt(localStorage.getItem("secondsDisplay")) : 0;    
    setTimeout(function() {
      me.setTimerValue()
    }, 60*60*0.3);
  }
  private startTimer(value) {
    if(value != 1){
        var me = this;
         var hoursDisplay,secondsDisplay,minutesDisplay;
           secondsDisplay =   parseInt(this.secondsDisplay.toString()) + 1;
           hoursDisplay = this.hoursDisplay;
           minutesDisplay = this.minutesDisplay;
          if(this.secondsDisplay == 60){
            minutesDisplay =  parseInt(this.minutesDisplay.toString()) + 1; 
            secondsDisplay = 0                  
          }
          if(this.minutesDisplay == 60){
             hoursDisplay = parseInt(this.hoursDisplay.toString()) + 1;  
            minutesDisplay =  0;                 
   
          }   
         localStorage.setItem("hoursDisplay",(hoursDisplay).toString());
         localStorage.setItem("minutesDisplay",(minutesDisplay).toString()); 
         localStorage.setItem("secondsDisplay",(secondsDisplay).toString());               
         localStorage.setItem("actual_hrs",(this.hoursDisplay + ((parseInt((this.minutesDisplay * 60).toString()) + parseInt(this.secondsDisplay.toString()))/3600)).toString());
       
          this.timer =  setTimeout(function() {
            if(value == 1){
               clearTimeout(this.timer);   
            } 
            else{
              me.startTimer(0) 
            }    
          }, 60*60*0.2);
        }
        else{
          clearTimeout(this.timer);                   
        }
}
UpdateAssignedTaskDetail(){
  console.log(this.AssignedtaskFormDetail);
  this.taskService.saveTaskDetail({reqData:[this.AssignedtaskFormDetail]}).subscribe(
    res => {
        if(res.success.successData.length!=0){
         this.comment_data="";
         this.checkCommnetAssign="";
         this.openAllTasks();
        }
    },
    error => this.toast.setMessage('Some thing wrong!', 'danger')
  );
}
startTaskFun(task){
  this.AssignedtaskFormDetail._id = task._id;
  this.AssignedtaskFormDetail.status = 1;
  this.AssignedtaskFormDetail.select = 1;
  this.paused = 0;  
      if(task && task.spendtimes.length > 0){
        delete this.AssignedtaskFormDetail['start_date_time'];
      }
      else{
        this.AssignedtaskFormDetail['start_date_time'] = new Date();             
      }
      this.startTimer(0);      
      delete this.AssignedtaskFormDetail['end_date_time'];
      this.AssignedtaskFormDetail.spendtime = {};
      this.spendtime['start_date_time'] = new Date();
      localStorage.setItem('select', (1).toString());
      localStorage.setItem('task_id',task._id.toString());      
      localStorage.setItem('spend_start_date_time', this.spendtime['start_date_time'].toDateString());      
      this.UpdateAssignedTaskDetail();
}
pauseTaskFun(task){
  var me =this;
  if (this.comment_data == null || this.comment_data == "" || this.comment_data ==undefined) {
    this.toast.setMessage('Comment should not be blank!', 'danger');
    return ;
  }else{
    this.AssignedtaskFormDetail._id = task._id;
    this.AssignedtaskFormDetail.status = 1;
    this.AssignedtaskFormDetail.select = 0;  
    this.paused = 1;
    delete this.AssignedtaskFormDetail['start_date_time'];
    localStorage.setItem('spend_start_date_time', "");        
    this.spendtime['end_date_time'] = new Date();
    this.spendtime['comment'] = this.comment_data;  
    localStorage.setItem('select', null);  
    localStorage.setItem("hoursDisplay",(0).toString());
    localStorage.setItem("minutesDisplay",(0).toString()); 
    localStorage.setItem("secondsDisplay",(0).toString());             
    me.startTimer(1)
    this.spendtime.actual_hrs = this.hoursDisplay + ((parseInt((this.minutesDisplay * 60).toString()) + parseInt(this.secondsDisplay.toString()))/3600);
    this.hoursDisplay = 0;            
    this.minutesDisplay = 0;               
    this.secondsDisplay = 0;  
    this.AssignedtaskFormDetail.spendtime = this.spendtime;
    this.UpdateAssignedTaskDetail();  
  }
}
finishTaskFun(task){
  if (this.comment_data == null || this.comment_data == "" || this.comment_data ==undefined) {
    this.toast.setMessage('Comment should not be blank!', 'danger');
    return ;
  }else{
    this.AssignedtaskFormDetail._id = task._id;
    this.AssignedtaskFormDetail.status = 2;
    this.AssignedtaskFormDetail.select = 0;  
    delete this.AssignedtaskFormDetail['start_date_time'];
    this.AssignedtaskFormDetail['end_date_time'] = new Date(); 
    this.spendtime['end_date_time'] = new Date();
    this.spendtime['comment'] = this.comment_data;    
    localStorage.setItem('select', null);  
    localStorage.setItem("hoursDisplay",(0).toString());
    localStorage.setItem("minutesDisplay",(0).toString()); 
    localStorage.setItem("secondsDisplay",(0).toString());       
    this.startTimer(1)  
    this.spendtime.actual_hrs = this.hoursDisplay + ((parseInt((this.minutesDisplay * 60).toString()) + parseInt(this.secondsDisplay.toString()))/3600);
    if(this.paused == 1)
      this.AssignedtaskFormDetail.spendtime = {};
    else
      this.AssignedtaskFormDetail.spendtime = this.spendtime;      
    this.paused = 0;
    this.hoursDisplay = 0;            
    this.minutesDisplay = 0;               
    this.secondsDisplay = 0;  
    this.UpdateAssignedTaskDetail();
  }
}
 //Vaibhav Mali 09 Jan 2018 ...End

  openProjectListDialog(){
    this.isShowproject=true;
    this.isShowList=false;
  }
  openTaskListDialog(selected_project){
    this.selected_project_detail=selected_project;
    this.selectedProjectId=selected_project._id;
    this.isShowproject=false;
    this.isShowList=true;
    this.isTaskActive=[true,false,false,false,false];
    this.openAllTasks();
  }
  openAllTasks(page ? :any){
    this.taskList=[];
    if(this.isActiveMyProject){
      this.getTaskDetailsByAssignFromAPi(page);
    }else if(this.isActiveAcceptProject){
      this.getDetailsByAssignToApi(page);
    }
  }
  getTaskDetailsByAssignFromAPi(page ? :any){
      let reqData={  
        "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
        "project_id":this.selectedProjectId ? this.selectedProjectId : "",
        "page" : page ? page.page : 1,
        "limit" : this.task_pagination.itemsPerPage
      }
      this.projectService.getTaskDetailsByAssignFrom({"reqData":reqData}).subscribe(
          res => {      
              if(res){
                for(var i=0;i<res.tasks.length;i++){
                  this.taskList.push(res.tasks[i]);
                }
                this.task_pagination.length=res.Total;
              }
          },
          error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  getDetailsByAssignToApi(page ? :any){
      let reqData={
        "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
        "project_id":this.selectedProjectId ? this.selectedProjectId : "",
        "page" : page ? page.page : 1,
        "limit" : this.task_pagination.itemsPerPage
      }
      this.projectService.getDetailsByAssignTo({"reqData":reqData}).subscribe(
          res => {
            if(res){
                for(var i=0;i<res.tasks.length;i++){
                  this.taskList.push(res.tasks[i]);
                }
                this.task_pagination.length=res.Total;
            }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
        );
  }
  callPaginationFun(page){
    if(this.isTaskActive[0]){
       this.openAllTasks(page);
    }else if(this.isTaskActive[1]){
      this.openRunningTasks(page);
    }else if(this.isTaskActive[2]){
      this.openPendingTasks(page);
    }else if(this.isTaskActive[3]){
      this.openCommingTasks(page);
    }else if(this.isTaskActive[4]){
      this.openCompletedTasks(page);
    }
  }
  openPendingTasks(page ? :any){
    this.taskList=[];
    let reqData= {
        "reqData":{
           "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
           "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
           "page" : page ? page.page : 1,
           "limit" : this.task_pagination.itemsPerPage,
           "flag" : this.isActiveMyProject==true ? 0 : 1
           }
    }
    console.log(reqData);
    this.homeService.getPendingTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.Pending;
          this.task_pagination.length=res.Total;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openCompletedTasks(page ? :any){
    this.taskList=[];
    let reqData= {
        "reqData":{
          "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
          "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
          "page" : page ? page.page : 1,
        "limit" : this.task_pagination.itemsPerPage,
          "flag" : this.isActiveMyProject==true ? 0 : 1
          }
    }
    console.log(reqData);
    this.homeService.getCompletedTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.Completed;
          this.task_pagination.length=res.Total;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openCommingTasks(page ? :any){
    this.taskList=[];
    let reqData= {
        "reqData":{
          "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
          "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
          "page" : page ? page.page : 1,
         "limit" : this.task_pagination.itemsPerPage,
          "flag" : this.isActiveMyProject==true ? 0 : 1
          }
    }
    console.log(reqData);
    this.homeService.getUpcomingTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.Upcoming;
          this.task_pagination.length=res.Total;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openRunningTasks(page ? :any){
    this.taskList=[];
    let reqData= {
        "reqData":{
          "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
          "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
          "page" : page ? page.page : 1,
          "limit" : this.task_pagination.itemsPerPage,
          "flag" : this.isActiveMyProject==true ? 0 : 1
          }
    }
    console.log(reqData);
    this.homeService.getIn_ProgressTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.In_Progress;
          this.task_pagination.length=res.Total;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openMyProject(){
    this.isActiveMyProject=true;
    this.isActiveAcceptProject=false;
    this.isActiveReqProject=false;
    // this.projectList=this.myProjectList;
    this.getProjectDetail(null,"MYPROJECT");
  }
  openAcceptedProject(){
    this.isActiveMyProject=false;
    this.isActiveAcceptProject=true;
    this.isActiveReqProject=false;
    this.getProjectDetail(null,"ACCEPTEDPROJECT");
    // this.projectList=this.AcceptedProjectList;
  }
  openRequestedProject(){
    this.isActiveMyProject=false;
    this.isActiveAcceptProject=false;
    this.isActiveReqProject=true;
    this.getProjectDetail(null,"REQUESTEDPROJECT");    
    // this.projectList=this.RequestedProjectList;
  }
  backBtn(){
    this.selected_project_detail={};
    this.isShowproject=true;
    this.isShowList=false;
    this.taskList=[];
  }
  getProjectDetail(page?:any,selected_project_pagination ? : any){
    let reqData={
        "reqData":{
        "email" : localStorage.getItem("email") ? localStorage.getItem("email") : "",
        "page" : page ? page.page : 1,
        "limit" : this.project_pagination.itemsPerPage
        }
    }
    this.homeService.getProjects(reqData).subscribe(
      res => {
        this.employeeDetail=res.details;
        if(selected_project_pagination=="MYPROJECT" || this.isActiveMyProject){
          this.projectList=res.details.MyProjects;
          this.project_pagination.length=res.details.MyProjectsTotal;
        }
        if(selected_project_pagination=="ACCEPTEDPROJECT" || this.isActiveAcceptProject){
          this.projectList=res.details.AcceptedProjects;
          this.project_pagination.length=res.details.AcceptedProjectsTotal;
        }
        if(selected_project_pagination=="REQUESTEDPROJECT" || this.isActiveReqProject){
          this.projectList=res.details.RequestedProjects;
          this.project_pagination.length=res.details.RequestedProjectsTotal;
        }
        // this.project_pagination.length=res.details.MyProjectsTotal;
        // this.project_pagination.length=res.details.AcceptedProjectsTotal;
        // this.project_pagination.length=res.details.RequestedProjectsTotal;
        // this.myProjectList=res.details.MyProjects;
        // this.AcceptedProjectList=res.details.AcceptedProjects;
        // this.RequestedProjectList=res.details.RequestedProjects;
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  arrayToString = function(string){
    let string_list=[];
    for(var i=0;i<string.length;i++){
      string_list.push(string[i].activity_name);
    }
    return string_list;
  }
  acceptProjectReq(ProdId){
      this.projectService.accpetProject(ProdId).subscribe(
        res => {
          this.toast.setMessage('Project request accepted successfully.', 'success');
          this.getProjectDetail();
          this.openRequestedProject();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  rejectProjectReq(ProdId){
      this.projectService.rejectProject(ProdId).subscribe(
        res => {
          this.toast.setMessage('Project request rejected successfully.', 'success');
          this.getProjectDetail();
          this.openRequestedProject();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
}
