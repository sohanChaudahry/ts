import { Component ,OnInit} from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { HomeService } from '../services/home.service';
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
  isActiveMyProject=true;
  isActiveAcceptProject=false;
  isActiveReqProject=false;
  isTaskActive=[true,false,false,false];
  taskList=[{"name":"Task 1"},{"name":"Task 2"},{"name":"Task 3"}];
  constructor(public toast: ToastComponent,
  private homeService:HomeService,
private auth:AuthService) { }

  ngOnInit() {
    this.auth.getLogedinUserData();
    setTimeout(()=>{    
      this.getProjectDetail();
    },100);
  }
  openProjectListDialog(){
    this.isShowproject=false;
    this.isShowList=true;
  }
  openTaskListDialog(){
    this.isShowproject=true;
    this.isShowList=false;
  }
  openAllTasks(){
    this.taskList=[{"name":"AllTask Task 1"},{"name":"AllTask Task 2"},{"name":"AllTask Task 3"}];
  }
  openCompletedTasks(){
    this.taskList=[{"name":"Completed Task 1"},{"name":"Completed Task 2"},{"name":"Completed Task 3"}];
  }
  openCommingTasks(){
    this.taskList=[{"name":"Comming Task 1"},{"name":"Comming Task 2"},{"name":"Comming Task 3"}];
  }
  openRunningTasks(){
    this.taskList=[{"name":"Running Task 1"},{"name":"Running Task 2"},{"name":"Running Task 3"}];
  }
  openMyProject(){
    this.projectList=this.myProjectList;
  }
  openAcceptedProject(){
    this.projectList=this.AcceptedProjectList;
  }
  openRequestedProject(){
    this.projectList=this.RequestedProjectList;
  }
  backBtn(){
    this.isShowproject=true;
    this.isShowList=false;
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
        this.openMyProject()
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
}
