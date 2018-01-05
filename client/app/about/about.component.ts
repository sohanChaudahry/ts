import { Component ,OnInit} from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { HomeService } from '../services/home.service';
import { ProjectService } from '../services/project.service';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']

})
export class AboutComponent implements OnInit{


  isShowproject=true;
  isShowList=false;
  employeeDetail = {};
  myProjectList=[];
  AcceptedProjectList=[];
  RequestedProjectList=[];
  projectList=[];

  upcomingTasksList=[];
  pendingTasksList=[];
  completedTasksList=[];
  inProgressTaskList=[];

  checkRequestedFlag=false;
  selectedProjectId="";
  isActiveMyProject=true;
  isActiveAcceptProject=false;
  isActiveReqProject=false;
  isTaskActive=[true,false,false,false];
  taskList=[];
  constructor(public toast: ToastComponent,
  private homeService:HomeService,
  private auth:AuthService,
  private projectService:ProjectService) { }

  ngOnInit() {
    this.auth.getLogedinUserData();
    setTimeout(()=>{    
      this.getProjectDetail();
    },50);
  }
  openProjectListDialog(){
    this.isShowproject=true;
    this.isShowList=false;
  }
  openTaskListDialog(selected_project){
    this.selectedProjectId=selected_project._id;
    this.isShowproject=false;
    this.isShowList=true;
    this.isTaskActive=[true,false,false,false];
    this.openPendingTasks();
  }
  openPendingTasks(){
    let reqData= {
        "reqData":{
           "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
           "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
           "page" : 1,
           "limit" : 10,
           "flag" : this.isActiveMyProject==true ? 0 : 1
           }
    }
    console.log(reqData);
    this.homeService.getPendingTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.Pending;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openCompletedTasks(){
    let reqData= {
        "reqData":{
          "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
          "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
          "page" : 1,
          "limit" : 10,
          "flag" : this.isActiveMyProject==true ? 0 : 1
          }
    }
    console.log(reqData);
    this.homeService.getCompletedTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.Completed;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openCommingTasks(){
    let reqData= {
        "reqData":{
          "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
          "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
          "page" : 1,
          "limit" : 10,
          "flag" : this.isActiveMyProject==true ? 0 : 1
          }
    }
    console.log(reqData);
    this.homeService.getUpcomingTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.Upcoming;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openRunningTasks(){
    let reqData= {
        "reqData":{
          "employee_id" : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
          "project_id" : this.selectedProjectId ? this.selectedProjectId : "",
          "page" : 1,
          "limit" : 10,
          "flag" : this.isActiveMyProject==true ? 0 : 1
          }
    }
    console.log(reqData);
    this.homeService.getIn_ProgressTasks(reqData).subscribe(
      res => {
        if(res){
          this.taskList=res.In_Progress;
        }
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  openMyProject(){
    this.isActiveMyProject=true;
    this.isActiveAcceptProject=false;
    this.isActiveReqProject=false;
    this.projectList=this.myProjectList;
  }
  openAcceptedProject(){
    this.isActiveMyProject=false;
    this.isActiveAcceptProject=true;
    this.isActiveReqProject=false;
    this.projectList=this.AcceptedProjectList;
  }
  openRequestedProject(){
    this.isActiveMyProject=false;
    this.isActiveAcceptProject=false;
    this.isActiveReqProject=true;
    this.projectList=this.RequestedProjectList;
  }
  backBtn(){
    this.isShowproject=true;
    this.isShowList=false;
    this.taskList=[];
  }
  getProjectDetail(){
    let reqData={
        "reqData":{
        "email" : localStorage.getItem("email") ? localStorage.getItem("email") : "",
        "page" : 1,
        "limit" : 10
        }
    }
    this.homeService.getProjects(reqData).subscribe(
      res => {
        this.employeeDetail=res.details;
        this.myProjectList=res.details.MyProjects;
        this.AcceptedProjectList=res.details.AcceptedProjects;
        this.RequestedProjectList=res.details.RequestedProjects;
        this.openMyProject();
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
