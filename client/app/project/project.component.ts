import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import {Popup} from 'ng2-opd-popup';

import { Observable, Subscription } from 'rxjs/Rx';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RecursiveService } from '../services/recursive.service';
interface taskFormData {
  task_title : string;
  task_description : string;
  assign_from ? : any;
  assign_to : any;
  project_id : any;
  activity_id : any;
  due_date : Date;
  assign_date : Date;  
  priority : string;
  estimate_hrs : number;
  actual_hrs ? : number;
  status ? : number;
  select ? : number;
  start_date_time ? : Date;
  end_date_time ? : Date;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  //Vaibhav Mali 06 Jan 2018 ...Start
  timer;
  ticks = 0;
  hoursDisplay: number = localStorage.getItem("hoursDisplay") ? parseInt(localStorage.getItem("hoursDisplay")) : 0;    
  minutesDisplay: number = localStorage.getItem("minutesDisplay") ? parseInt(localStorage.getItem("minutesDisplay")) : 0;    
  secondsDisplay: number = localStorage.getItem("secondsDisplay") ? parseInt(localStorage.getItem("secondsDisplay")) : 0;    
  sub: Subscription; 
  //Vaibhav Mali 06 Jan 2018 ...End
  public employeesToshow  :Array<any>=[];
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  isLoading=false;
  isProjectRunning = null; 
  iscurrentProject = 0;
  isLoading1=false;  
  employeesList=[];
  projectList=[];
  isEmpAutoSelect=[];
  AssignedProjectsList=[];
  MyProjectsList=[];
  requestedProjectList=[];  
  AssignedProjectView={};
  selectedProjectDetail={"_id":""};
  AssigedToOtherList=[];
  getTaskAssigedToUsList=[];
  selected_proj_delete={};
  roleList=["Developer","Tester"];
  addAssignUserList=[];
  activityData=[{"name":"","activity_id":""}];
  activityList=[];
  addAssignTaskUserList=[];
  projectWorkingTaskList=[];  
  statusList=[{"val":0,"name":"Assigned"},{"val":1,"name":"In Progress"},{"val":2,"name":"Completed"},{"val":3,"name":"Failed"}];
  priorityList=["P0","P1","P2","P3","P4","P5"];
  isProjectList=true;
  me = this;
  iscreateProject=false;
  isAssignProjView=false;
  isMyTaskEdit=false; 
  isShowAssignedTask=true;
  isTaskListView=false; 
  isAssignedTaskEdit=false;
  isTaskCardShow=false;
  isProjectWorkingTask=false;
  init = 0;
  selectvalue = 0;
  task_id = "";
  paused = 0;  
  taskFormDetail : taskFormData = {
     task_title :"",
     task_description : "",
     assign_from:"",
     assign_to : "",
     project_id : "",
     activity_id : "",
     assign_date : new Date(),     
     due_date : new Date(),
     priority : "",
     estimate_hrs : null,
  };
  AssignedtaskFormDetail = {
    _id:"",
    select:0,
    status:0,
 //   start_date_time : new Date(),
    //end_date_time : new Date(),
    spendtime : {}
 };
 spendtime = {
  start_date_time : new Date(),
  end_date_time : new Date(),
  actual_hrs : 0
}
  getProjectForm: FormGroup;
  project_id = new FormControl('');
  project_name = new FormControl('', Validators.required);
  role = new FormControl('', Validators.required);
  desc = new FormControl('', Validators.required);
  email = new FormControl('');
  activities = new FormControl([]);
  assign_to = new FormControl([]);
  settings1 = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-MMM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect:true
}
  projectDetail={
      "_id":"",
      "project_id":"",
      "project_name":"",
      "role":"",
      "desc":"",
      "email":"",
      "activities":[],
      "assign_to":[]
  };
  searchEmpDetail={
    "name":"",
    "role":"",
    "to_email":""
  }
  constructor(public toast:ToastComponent,
  private projectService:ProjectService,
  private formBuilder:FormBuilder,
  private taskService : TaskService,
  private userService: UserService,
  private recursiveService :RecursiveService,
  private popup:Popup) { }
  
  ngOnInit() {
      this.getAllEmployeeList();
      // this.getEmployeeDetailByEmail();
      this.getEmployeeDetailAllData();      
      this.updateProjectRequeststatus();
      this.setTimerValue();
      // this.getRequestedProjectsFun();
      this.getProjectForm = this.formBuilder.group({
        project_id: this.project_id,
        project_name:this.project_name,
        role: this.role,
        desc:this.desc,
        email:this.email,
        activities:this.activities,
        assign_to:this.assign_to,
      });
      this.popup.options = {
        header: "Delete Project",
        color: "#5cb85c", // red, blue.... 
        widthProsentage: 40, // The with of the popou measured by browser width 
        animationDuration: 1, // in seconds, 0 = no animation 
        showButtons: true, // You can hide this in case you want to use custom buttons 
        confirmBtnContent: "OK", // The text on your confirm button 
        cancleBtnContent: "Cancel", // the text on your cancel button 
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button 
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
      };
      //Vaibhav Mali 06 Jan 2018 ...Start
      this.selectvalue = localStorage.getItem("select") ? parseInt( localStorage.getItem("select")) : 0;      
      if(parseInt(this.selectvalue.toString()) == 1){
        this.AssignedtaskFormDetail._id = localStorage.getItem("task_id").toString();
        this.AssignedtaskFormDetail.select = 1;
        this.ticks = this.secondsDisplay;
       // this.sub.unsubscribe();
        this.setTimerValue()
        this.startTimer(0);
      
      }
      //Vaibhav Mali 06 Jan 2018 ...End
  }
  private get disabledV():string {
    return this._disabledV;
  }
  //Vaibhav Mali 27 Dec 2017 ...Start
  updateProjectRequeststatus(){
    this.recursiveService.UpdateProjectRequestFlag();
  }
  //Vaibhav Mali 27 Dec 2017 ...End
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
  reSetTaskFormValue(){
      this.taskFormDetail = {
          task_title :"",
          task_description : "",
          assign_from:"",
          assign_to : "",
          project_id : "",
          activity_id : "",
          due_date : new Date(),
          assign_date : new Date(),          
          priority : "",
          estimate_hrs : null,
          actual_hrs  : null,
          status : null,
          select : null,
          start_date_time : new Date(),
          end_date_time : new Date(),
    };
  }
  openPopup(project_detail){
    this.selected_proj_delete=project_detail;
    this.popup.show();
  }
  conformPopup(){
    this.popup.hide();
    this.deleteProjects(this.selected_proj_delete);
  }
  cancelPopup(){
    this.popup.hide();
  }
  public selected(value:any):void {
    console.log('Selected value is: ', value);
    this.searchEmpDetail.name=value.text;
  }
 
  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  public typed(value:any):void {
    console.log('New search input: ', value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
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
  
  addActivity(){
    this.activityData.push({"name":"","activity_id":""});
  }
  removeActivity(index){   
      this.activityData.splice(index,1);
      if(this.activityData.length==0){
          this.addActivity();
      }
  }
  cancel(){
    this.isProjectList=true;
    this.iscreateProject=false;
    this.isAssignProjView=false;
    this.activityData=[{"name":"","activity_id":""}];
  }
  cancelCreateTaskPage(){
     this.iscreateProject=false; 
     this.isProjectList=false;  
     this.isAssignedTaskEdit=false; 
     this.isMyTaskEdit=false; 
     this.isTaskListView=true;
     this.isAssignProjView=false;
     this.isTaskCardShow=true;
  }
  cancelView(){
    this.isProjectList=true;
    this.iscreateProject=false;
    this.isAssignProjView=false;
  }
  openTaskListPage(project_detail,flag){
     if(this.isProjectRunning == project_detail._id){
       this.iscurrentProject = 1;
     }
     else{
       this.iscurrentProject = 0;
     }
     this.isShowAssignedTask=flag;
     this.selectedProjectDetail=project_detail;
     this.iscreateProject=false; 
     this.isProjectList=false;  
     this.isAssignedTaskEdit=false; 
     this.isMyTaskEdit=false; 
     this.isTaskListView=true;
     this.isAssignProjView=false;
     this.isTaskCardShow=true;
     this.getTaskDetailsByAssignFromAPi();
     this.getDetailsByAssignToApi();
  }
  openCreateTaskPage(){
     this.iscreateProject=false; 
     this.isProjectList=false;  
     this.isAssignedTaskEdit=false; 
     this.isMyTaskEdit=true; 
     this.isTaskListView=false;
     this.isAssignProjView=false;

    //  this.reSetTaskFormValue();
     this.taskFormDetail.task_title  = "";
     this.taskFormDetail.task_description  =  "";
     this.taskFormDetail.assign_to  =  "";
     this.taskFormDetail.project_id  = "";
     this.taskFormDetail.activity_id  = "";
     this.taskFormDetail.due_date  = new Date();
     this.taskFormDetail.assign_date = new Date();     
     this.taskFormDetail.priority  = "";
     this.taskFormDetail.estimate_hrs  =  null,
     this.getProjectDetailByIdForTask(this.selectedProjectDetail._id);
  }
  openProjectWorkingTask(projec_detail,selected_follower){
    this.isProjectList=false;
    this.iscreateProject=false;
    this.isAssignProjView=false;
    this.isProjectWorkingTask=true;
    let req_data={
        reqData:{
          employee_id : selected_follower.employee_id ? selected_follower.employee_id : "",
          project_id : projec_detail._id ? projec_detail._id :""
        }
    }
    this.projectService.ProjectWorkingTaskApi(req_data).subscribe(
      res => {
        console.log(res);
        this.projectWorkingTaskList=res.tasks;
        if(this.projectWorkingTaskList.length!=0){
           for(let i=0;i<this.projectWorkingTaskList.length;i++){
             if(this.projectWorkingTaskList[i].start_date_time!=null && this.projectWorkingTaskList[i].start_date_time!='' && this.projectWorkingTaskList[i].start_date_time!=undefined){
                 if(this.projectWorkingTaskList[i].spendtimes.length!=0){
                   let index=this.projectWorkingTaskList[i].spendtimes.length;
                   this.projectWorkingTaskList[i].seen_time=this.projectWorkingTaskList[i].spendtimes[index-1].end_date_time;
                 }else{
                   this.projectWorkingTaskList[i].seen_time=this.projectWorkingTaskList[i].start_date_time;
                 }
             }else{
               this.projectWorkingTaskList[i].seen_time=null;
             }
         }
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  editMyTaskBtn(task_detail){
     this.iscreateProject=false; 
     this.isProjectList=false;  
     this.isAssignedTaskEdit=false; 
     this.isMyTaskEdit=true; 
     this.isTaskListView=false;
     this.isAssignProjView=false;
    //  this.taskFormDetail=task_detail;
  
    this.taskFormDetail.assign_to=task_detail.assign_to._id ? task_detail.assign_to._id : task_detail.assign_to ;
    this.taskFormDetail.activity_id=task_detail.activity_id._id ? task_detail.activity_id._id : task_detail.activity_id ;
    //Vaibhav Mali 29 Dec 2017 ...Updated
    // this.taskFormDetail=task_detail;
     this.getProjectDetailByIdForTask(this.selectedProjectDetail._id);
     this.getTaskDetailsByTaskIdApi(task_detail._id);
  }
  backTaskListPage(){
     this.iscreateProject=false; 
     this.isProjectList=true;  
     this.isAssignedTaskEdit=false; 
     this.isMyTaskEdit=false; 
     this.isTaskListView=false;
     this.isAssignProjView=false;
     this.isTaskCardShow=false;
  }
  backProjectWorkingTaskPage(){
    this.iscreateProject=true; 
     this.isProjectList=false;  
     this.isAssignedTaskEdit=false; 
     this.isMyTaskEdit=false; 
     this.isTaskListView=false;
     this.isAssignProjView=false;
     this.isTaskCardShow=false;
     this.isProjectWorkingTask=false;
  }
  sendProjectFormData(){

    if(this.projectDetail.project_name=='' || this.projectDetail.project_name==null || !this.projectDetail.project_name){
      this.toast.setMessage('Project name should not be blank!', 'danger');
      return;
    }
    if(this.projectDetail.desc=='' || this.projectDetail.desc==null || !this.projectDetail.desc){
      this.toast.setMessage('Project description should not be blank!', 'danger');
      return;
    }
  
    // for(var i=0;i<this.activityData.length;i++){
    //   if(this.activityData[i].name=='' || this.activityData[i].name==null || !this.activityData[i].name){
    //     this.toast.setMessage('Activity name should not be blank!', 'danger')
    //     return;
    //   }
    // }
    // if(this.addAssignUserList.length==0){
    //   this.toast.setMessage('Please select employee to assign project.', 'danger')
    //   return;
    // }
    this.projectDetail.email=localStorage.getItem("email") ? localStorage.getItem("email") : "";
    this.projectDetail.role="Manager";
    this.projectDetail.activities=this.activityData;
    this.projectDetail.assign_to=this.addAssignUserList;
    if(this.projectDetail._id){
        this.projectDetail.project_id=this.projectDetail._id;
    }
    for(var i=0;i<this.projectDetail.activities.length;i++){
        this.projectDetail.activities[i].activity_name=this.projectDetail.activities[i].name;
    }
    this.isLoading1=true;   
    // this.spinnerService.show();
    this.projectService.saveProjectDetails({"reqData":[this.projectDetail]}).subscribe(
      res => {
        this.isLoading1=false;   
        //  this.spinnerService.hide();
         if(res.successProjects.successData.length!=0){
          this.isProjectList=true;
          this.iscreateProject=false;
          this.toast.setMessage('Project saved successfully!', 'success')
          // this.getEmployeeDetailByEmail();
          this.getEmployeeDetailAllData();
          
         }else if(res.failedProjects.failedData.length!=0){
          this.toast.setMessage('Project create failed.', 'danger')
         }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }  
  getAllEmployeeList() {
      this.projectService.getAllEmployee().subscribe(
        res => {
           let data=res;
           this.employeesList=res.employees;
           for(var i=0;i<this.employeesList.length;i++){
               this.employeesToshow.push(this.employeesList[i].name);
           }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  deleteProjects(selected_project){
       this.projectService.deleteProject(selected_project._id).subscribe(
        res => {
          if(res){
            this.toast.setMessage('Project deleted successfully!', 'success');
            //this.getEmployeeDetailByEmail();
            this.getEmployeeDetailAllData();
          }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  projectEditBtm(selectedProject){
      this.isProjectList=false;
      this.iscreateProject=true;
      this.isAssignProjView=false;
      this.addAssignUserList=[];
      this.activityData=[];
      this.getProjectDetailById(selectedProject._id)
  }
   /*
  @author : Vaibhav Mali 
  @date : 29 Dec 2017
  @fn : IsFollowerExist
  @desc :To check whether current project have followers or not.
  */
  IsFollowerExist(selectedProject){
      this.projectService.getProjectDetailById(selectedProject._id).subscribe(
        res => {
          if(res && res.followers.length > 0) 
            return 1;
          else
            return 0;
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  showAssignedProjectView(selected_data){
      this.isProjectList=false;
      this.iscreateProject=false;
      this.isAssignProjView=true;
      // this.AssignedProjectView=selected_data;
      this.getAssignedProjectDetailById(selected_data._id);
  }
  getAssignedProjectDetailById(ProdId){
      this.projectService.getProjectDetailById(ProdId).subscribe(
        res => {
          this.AssignedProjectView=res;
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  craeteProjectBtn(){
      this.isProjectList=false;
      this.iscreateProject=true;
      this.isAssignedTaskEdit=false; 
      this.isMyTaskEdit=false; 
      this.isTaskListView=false;
      this.isAssignProjView=false;
      this.isTaskCardShow=false;
      this.projectDetail={
        "_id":"",
        "project_id":"",
        "project_name":"",
        "role":"",
        "desc":"",
        "email":"",
        "activities":[],
        "assign_to":[]
      };
      this.activityData=[{"name":"","activity_id":""}];
      this.addAssignUserList=[];
  }
  getTaskDetailsByAssignFromAPi(){
      let reqData={  
        "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
        "project_id":this.selectedProjectDetail._id ? this.selectedProjectDetail._id : ""
      }
      this.projectService.getTaskDetailsByAssignFrom({"reqData":reqData}).subscribe(
          res => {      
              if(res){
                  this.getTaskAssigedToUsList=res.tasks;
              }
          },
          error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  getDetailsByAssignToApi(){
      let reqData={
        "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
        "project_id":this.selectedProjectDetail._id ? this.selectedProjectDetail._id : ""
      }
      this.projectService.getDetailsByAssignTo({"reqData":reqData}).subscribe(
          res => {
            if(res){
                this.AssigedToOtherList=res.tasks;
                for(var i=0;i<this.AssigedToOtherList.length;i++){
                  this.AssigedToOtherList[i].isStart=false;
                  this.AssigedToOtherList[i].isPause=false;
                  this.AssigedToOtherList[i].isFinish=false;
                 }
          }
          console.log(this.AssigedToOtherList);
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
         );
  }
   /*
  @author : Vaibhav Mali 
  @date : 29 Dec 2017
  @fn : getTaskDetailsByTaskIdApi
  @desc :Get task details by task id.
  */
  getTaskDetailsByTaskIdApi(taskId){
    this.projectService.getTaskDetailsByTaskId(taskId).subscribe(
        res => {
          if(res){
           //   this.AssigedToOtherList=res.tasks;
           this.taskFormDetail.activity_id = res.activity_id._id;
           this.taskFormDetail.assign_from = res.assign_from._id;
           this.taskFormDetail.assign_to = res.assign_to._id;
           this.taskFormDetail.estimate_hrs = res.estimate_hrs;
           this.taskFormDetail.priority = res.priority;
           this.taskFormDetail.task_description = res.task_description;
           this.taskFormDetail.due_date = res.due_date;

           this.taskFormDetail.assign_date = res.assign_date;
           
           this.taskFormDetail.task_title= res.task_title;
           this.taskFormDetail.task_description = res.task_description;  
         //  this.taskFormDetail['_id'] = res.__id;
           this.task_id = res._id;
          }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
 /*
  @author : Vaibhav Mali 
  @date : 29 Dec 2017
  @fn : startTimer,getSeconds,getMinutes,getHours,pad,UpdateAssignedTaskDetail,startTaskFun,
        pauseTaskFun,finishTaskFun,setTimerValue
  */
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
  
  private getSeconds(ticks: number) {
      return this.pad(ticks % 60);
   }
  
   private getMinutes(ticks: number) {
      return this.pad((Math.floor(ticks / 60)) % 60);
   }
  
  private getHours(ticks: number) {
      return this.pad(Math.floor((ticks / 60) / 60));
   }
  
  private pad(digit: any) { 
     return digit <= 9 ? '0' + digit : digit;
  }
UpdateAssignedTaskDetail(){
  console.log(this.AssignedtaskFormDetail);
  this.taskService.saveTaskDetail({reqData:[this.AssignedtaskFormDetail]}).subscribe(
    res => {
        if(res.success.successData.length!=0){
          //this.toast.setMessage('Task add successfully!', 'success');
          this.getTaskDetailsByAssignFromAPi()
          this.getDetailsByAssignToApi();
          this.iscreateProject=false; 
          this.isProjectList=false;  
          this.isAssignedTaskEdit=false; 
          this.isMyTaskEdit=false; 
          this.isTaskListView=true;
          this.isAssignProjView=false;
          this.isTaskCardShow=true;
        }
    },
    error => this.toast.setMessage('Some thing wrong!', 'danger')
  );
}
startTaskFun(task){
  this.AssignedtaskFormDetail._id = task._id;
  this.isProjectRunning = task.project_id;
  this.AssignedtaskFormDetail.status = 1;
  this.AssignedtaskFormDetail.select = 1;
 // this.projectService.getTaskDetailsByTaskId(task._id).subscribe(
    //res => {
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
//  })
}
pauseTaskFun(task){
  var me =this;
  this.AssignedtaskFormDetail._id = task._id;
  this.isProjectRunning = null;
  this.AssignedtaskFormDetail.status = 1;
  this.AssignedtaskFormDetail.select = 0;  
  this.paused = 1;
  delete this.AssignedtaskFormDetail['start_date_time'];
  localStorage.setItem('spend_start_date_time', "");        
  this.spendtime['end_date_time'] = new Date();
  localStorage.setItem('select', null);  
  localStorage.setItem("hoursDisplay",(0).toString());
  localStorage.setItem("minutesDisplay",(0).toString()); 
  localStorage.setItem("secondsDisplay",(0).toString());             
//  this.sub.unsubscribe(); 
  me.startTimer(1)
  this.spendtime.actual_hrs = this.hoursDisplay + ((parseInt((this.minutesDisplay * 60).toString()) + parseInt(this.secondsDisplay.toString()))/3600);
  this.hoursDisplay = 0;            
  this.minutesDisplay = 0;               
  this.secondsDisplay = 0;  
  console.log(this.spendtime.actual_hrs);
  this.AssignedtaskFormDetail.spendtime = this.spendtime;
  this.UpdateAssignedTaskDetail();  
}
finishTaskFun(task){
  this.isProjectRunning = null;
  this.AssignedtaskFormDetail._id = task._id;
  this.AssignedtaskFormDetail.status = 2;
  this.AssignedtaskFormDetail.select = 0;  
  delete this.AssignedtaskFormDetail['start_date_time'];
  this.AssignedtaskFormDetail['end_date_time'] = new Date(); 
  this.spendtime['end_date_time'] = new Date();
 // this.sub.unsubscribe();   
  this.startTimer(1)  
  this.spendtime.actual_hrs = this.hoursDisplay + ((parseInt((this.minutesDisplay * 60).toString()) + parseInt(this.secondsDisplay.toString()))/3600);
  console.log(this.spendtime.actual_hrs);
  if(this.paused == 1)
    this.AssignedtaskFormDetail.spendtime = {};
  else
    this.AssignedtaskFormDetail.spendtime = this.spendtime;      
  this.paused = 0;
  this.UpdateAssignedTaskDetail();
}
  addSelectedEmp(){
    if(this.searchEmpDetail.name && this.searchEmpDetail.role){
      for(var i=0;i<this.addAssignUserList.length;i++){
        if(this.addAssignUserList[i].name==this.searchEmpDetail.name){
          this.toast.setMessage('Employee already selected!', 'danger');
          return;
        }
      }
        for(var i=0;i<this.employeesList.length;i++){
            if(this.employeesList[i].name==this.searchEmpDetail.name){
                this.searchEmpDetail.to_email=this.employeesList[i].email;
                break;
            }
        }
        this.addAssignUserList.push(this.searchEmpDetail);
        this.searchEmpDetail={
          "name":"",
          "role":"",
          "to_email":""
        }
        this.isEmpAutoSelect=[];
      }else{
        this.toast.setMessage('Please select all value!', 'danger')
      }
  }
  
  getProjectDetailById(ProdId){
      this.projectService.getProjectDetailById(ProdId).subscribe(
        res => {
           this.projectDetail=res;
           this.addAssignUserList=[];
           this.addAssignTaskUserList=[];
           this.activityList=[];
           if(this.projectDetail.activities.length!=0){
              for(var i=0;i<this.projectDetail.activities.length;i++){
                this.activityData.push({"name":this.projectDetail.activities[i].activity_name,"activity_id":this.projectDetail.activities[i]._id});
              }
           }
           if(res.followers.length!=0){
              for(var i=0;i<res.followers.length;i++){
                this.addAssignUserList.push(res.followers[i]);
              }
           }
           if(res.followers.length!=0){
              for(var i=0;i<res.followers.length;i++){
                this.addAssignTaskUserList.push(res.followers[i]);
              }
           }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
    }
    getProjectDetailByIdForTask(ProdId){
      this.projectService.getProjectDetailById(ProdId).subscribe(
        res => {
           let task_all_detail=res;
           this.addAssignTaskUserList=[];
           this.activityList=[];
           if(task_all_detail.activities.length!=0){
              for(var i=0;i<task_all_detail.activities.length;i++){
                this.activityList.push({"name":task_all_detail.activities[i].activity_name,"activity_id":task_all_detail.activities[i]._id});
              }
           }
           if(res.followers.length!=0){
              for(var i=0;i<res.followers.length;i++){
                this.addAssignTaskUserList.push(res.followers[i]);
              }
           }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }

  acceptProjectReq(ProdId){
      this.projectService.accpetProject(ProdId).subscribe(
        res => {
           this.toast.setMessage('Project request accepted successfully.', 'success')
          // this.getEmployeeDetailByEmail();
          this.getEmployeeDetailAllData();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  rejectProjectReq(ProdId){
      this.projectService.rejectProject(ProdId).subscribe(
        res => {
           this.toast.setMessage('Project request rejected successfully.', 'success');
           //this.getEmployeeDetailByEmail();
           this.getEmployeeDetailAllData();
          },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  removeAssignUserFun(data,Prod_detail){
      if(Prod_detail && Prod_detail._id && data.email && data._id){
          console.log(data);
          var reqData={
              "reqData" : {
                  project_id:Prod_detail._id,
                  email:data.email
              }
          }
          console.log(reqData);
          this.projectService.removeAssignUser(reqData).subscribe(
            res => {
              if(res.success==true){
                  for(var i=0;i<this.addAssignUserList.length;i++){
                      if(this.addAssignUserList[i].name==data.name){
                          this.addAssignUserList.splice(i,1);
                          break;
                      }
                  }
              }
              this.toast.setMessage('Employee Removed from this project!', 'success')
            },
            error => this.toast.setMessage('Some thing wrong!', 'danger')
          );
      }else{
          for(var i=0;i<this.addAssignUserList.length;i++){
            if(this.addAssignUserList[i].name==data.name){
                this.addAssignUserList.splice(i,1);
                break;
            }
          }
          this.toast.setMessage('Employee Removed from this project!', 'success')
      }
  }
  exitProjectReq(ProdId){
      let reqData={
        "reqData":{
            project_id:ProdId._id,
            email:localStorage.getItem("email") ? localStorage.getItem("email") : ""
        }
      }
      console.log(reqData);
      this.projectService.removeAssignUser(reqData).subscribe(
        res => {
           this.toast.setMessage('Exit project group successfully.', 'success')
           //this.getEmployeeDetailByEmail();
           this.getEmployeeDetailAllData();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  getEmployeeDetailByEmail(){
    let reqData={
       "email":localStorage.getItem("email") ? localStorage.getItem("email") : ""
    }
    this.projectService.getEmpDetailApi({"reqData":reqData}).subscribe(
        res => {
           this.MyProjectsList=res.details.MyProjects;
           this.AssignedProjectsList=res.details.AssignedProjects;
           let project_list=[];
            
            if(res.details.MyProjects.length!=0){
                for(var i=0;i<res.details.MyProjects.length;i++){
                    project_list.push(res.details.MyProjects[i]);
                }
            }
            if(res.details.AssignedProjects.length!=0){
                for(var i=0;i<res.details.AssignedProjects.length;i++){
                  if(res.details.AssignedProjects[i].accept==1){
                     project_list.push(res.details.AssignedProjects[i]);
                  }
                }
            }   
            this.projectList=project_list;
           this.getRequestedProjectsFun();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  // get project data with pagination    requestedProjectList=[];

  getEmployeeDetailAllData(){
    let reqData={
      "email":localStorage.getItem("email") ? localStorage.getItem("email") : "",
      "page" : 1,
      "limit" : 20
    }
  //  this.spinnerService.show();
   this.projectService.getdetailsByEmailwithPagination({"reqData":reqData}).subscribe(
       res => {
          // this.spinnerService.hide();
          this.MyProjectsList=res.details.MyProjects;
          this.AssignedProjectsList=res.details.AcceptedProjects;
          this.requestedProjectList=res.details.RequestedProjects;
          let project_list=[];
           if(this.MyProjectsList.length!=0){
               for(var i=0;i<this.MyProjectsList.length;i++){
                   project_list.push(this.MyProjectsList[i]);
               }
           }
           if(this.AssignedProjectsList.length!=0){
               for(var i=0;i<this.AssignedProjectsList.length;i++){
                 if(this.AssignedProjectsList[i].accept==1){
                    project_list.push(this.AssignedProjectsList[i]);
                 }
               }
           }   
           this.projectList=project_list;
       },
       error => this.toast.setMessage('Some thing wrong!', 'danger')
   );
  }
  getRequestedProjectsFun(){
    this.projectService.getrequestedProjects().subscribe(
        res => {
          console.log(res.details.RequestedProjects);
          if(res.details.RequestedProjects.length!=0){
              for(var i=0;i<res.details.RequestedProjects.length;i++){
                  this.AssignedProjectsList.push(res.details.RequestedProjects[i]);
              }
          }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  saveTaskDetail(){
    let id=localStorage.getItem("_id") ? localStorage.getItem("_id") : "";  
    this.taskFormDetail.assign_from=id;
    this.taskFormDetail.activity_id=this.taskFormDetail.activity_id.activity_id ? this.taskFormDetail.activity_id.activity_id : this.taskFormDetail.activity_id;
    this.taskFormDetail.assign_to=this.taskFormDetail.assign_to.employee_id ? this.taskFormDetail.assign_to.employee_id : this.taskFormDetail.assign_to;
    this.taskFormDetail.project_id=this.selectedProjectDetail._id ? this.selectedProjectDetail._id : "";
    // Vaibhav Mali 29 Dec 2017 ... Start
    if(this.task_id == ""){
      delete this.taskFormDetail['_id'];
    }
    else{
      this.taskFormDetail['_id'] = this.task_id;
    }
    this.taskFormDetail['spendtime'] = {};
    console.log(this.taskFormDetail);

    if(this.taskFormDetail.task_title==null || !this.taskFormDetail.task_title|| this.taskFormDetail.task_title==''){
      this.toast.setMessage('Task title should not be blank!', 'danger');
      return;
    }
    if(this.taskFormDetail.estimate_hrs==null || !this.taskFormDetail.estimate_hrs){
      this.toast.setMessage('Task estimate hours should not be blank!', 'danger');
      return;
    }
    if(this.taskFormDetail.activity_id==null || !this.taskFormDetail.activity_id || this.taskFormDetail.activity_id==''){
      this.toast.setMessage('Please select any activity!', 'danger');
      return;
    } 
    if(this.taskFormDetail.assign_to==null || !this.taskFormDetail.assign_to || this.taskFormDetail.assign_to==''){
      this.toast.setMessage('Please select any employee to assign task!', 'danger');
      return;
    }
    if(this.taskFormDetail.priority==null || !this.taskFormDetail.priority || this.taskFormDetail.priority==''){
      this.toast.setMessage('Task priority should not be blank!', 'danger');
      return;
    } 
    if(this.taskFormDetail.task_description==null || !this.taskFormDetail.task_description || this.taskFormDetail.task_description==''){
      this.toast.setMessage('Task description should not be blank!', 'danger');
      return;
    } 
    // Vaibhav Mali 29 Dec 2017 ...End
    this.taskService.saveTaskDetail({reqData:[this.taskFormDetail]}).subscribe(
      res => {
           this.task_id = "";
          if(res.success.successData.length!=0){
            this.toast.setMessage('Task add successfully!', 'success');
            this.getTaskDetailsByAssignFromAPi()
            this.getDetailsByAssignToApi();
            this.iscreateProject=false; 
            this.isProjectList=false;  
            this.isAssignedTaskEdit=false; 
            this.isMyTaskEdit=false; 
            this.isTaskListView=true;
            this.isAssignProjView=false;
            this.isTaskCardShow=true;
          }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  changeProjectOption(data){
     console.log(data);
     this.taskFormDetail.activity_id="";
     this.employeesList=[];
     this.employeesToshow=[];
     this.getProjectDetailById(data);
   }
}
