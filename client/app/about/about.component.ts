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
  private projectService:ProjectService) { }
  task_pagination={
    page:1,
    itemsPerPage:10,
    maxSize:5,
    numPages:5,
    length:0
  }
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
