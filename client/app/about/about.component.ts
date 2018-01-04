import { Component ,OnInit} from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { HomeService } from '../services/home.service';

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
  taskList=[{"name":"Task 1"},{"name":"Task 2"},{"name":"Task 3"}];
  constructor(public toast: ToastComponent,
  private homeService:HomeService) { }

  ngOnInit() {

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
    this.projectList=[{"name":"AcceptedProject project 1"},{"name":"AcceptedProject project 2"},{"name":"AcceptedProject project 3"}];
  }
  openRequestedProject(){
    this.projectList=[{"name":"RequestedProject project 1"},{"name":"RequestedProject project 2"},{"name":"RequestedProject project 3"}];
  }
  backBtn(){
    this.isShowproject=true;
    this.isShowList=false;
  }
  getProjectDetail(){
    this.homeService.getProjects({"reqData":[]}).subscribe(
      res => {
        console.log(res);
        this.employeeDetail=res;
        this.myProjectList=res.MyProjects;
        this.AcceptedProjectList=res.AcceptedProjects;
        this.RequestedProjectList=res.RequestedProjects;
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
}
