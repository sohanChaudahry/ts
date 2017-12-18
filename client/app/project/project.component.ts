import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { ProjectService } from '../services/project.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  public employeesToshow  :Array<any>=[];
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  isLoading=false;
  employeesList=[];
  projectList=[];
  isEmpAutoSelect=[];
  AssignedProjectsList=[];
  MyProjectsList=[];
  roleList=["Manager","Developer","Tester"];
  addAssignUserList=[];
  activityData=[{"name":"","activity_id":""}];
  isProjectList=true;
  iscreateProject=false;
  getProjectForm: FormGroup;
  project_id = new FormControl('');
  project_name = new FormControl('', Validators.required);
  role = new FormControl('', Validators.required);
  desc = new FormControl('', Validators.required);
  email = new FormControl('');
  activities = new FormControl([]);
  assign_to = new FormControl([]);

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
  private formBuilder:FormBuilder) { }
  
  ngOnInit() {
      this.getAllEmployeeList();
      this.getEmployeeDetailByEmail();
      this.getProjectForm = this.formBuilder.group({
        project_id: this.project_id,
        project_name:this.project_name,
        role: this.role,
        desc:this.desc,
        email:this.email,
        activities:this.activities,
        assign_to:this.assign_to,
     });
  }
  private get disabledV():string {
    return this._disabledV;
  }
 
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
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
    this.activityData=[{"name":"","activity_id":""}];
  }
  sendProjectFormData(Data){
    //test
    this.projectDetail.email="sc205@enovate-it.com";
    this.projectDetail.activities=this.activityData;
   
    this.projectDetail.assign_to=this.addAssignUserList;
    console.log(this.projectDetail);
    if(this.projectDetail._id){
        this.projectDetail.project_id=this.projectDetail._id;
    }
    for(var i=0;i<this.projectDetail.activities.length;i++){
        this.projectDetail.activities[i].activity_name=this.projectDetail.activities[i].name;
    }
    this.projectService.saveProjectDetails({"reqData":[this.projectDetail]}).subscribe(
      res => {
         console.log(res);
         this.isProjectList=true;
         this.iscreateProject=false;
         this.getEmployeeDetailByEmail();
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
  projectEditBtm(selectedProject){
      this.isProjectList=false;
      this.iscreateProject=true;
      this.getProjectDetailById(selectedProject._id)
  }
  craeteProjectBtn(){
    this.isProjectList=false;
    this.iscreateProject=true;
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
  }
  addSelectedEmp(){
    if(this.searchEmpDetail.name && this.searchEmpDetail.role){
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
    }
  }
  getProjectDetailById(ProdId){
      this.projectService.getProjectDetailById(ProdId).subscribe(
        res => {
           this.projectDetail=res;
           if(this.projectDetail.activities.length!=0){
              this.activityData=[];
              for(var i=0;i<this.projectDetail.activities.length;i++){
                this.activityData.push({"name":this.projectDetail.activities[i].activity_name,"activity_id":this.projectDetail.activities[i]._id});
              }
           }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  acceptProjectReq(ProdId){
      this.projectService.accpetProject(ProdId).subscribe(
        res => {
           this.getEmployeeDetailByEmail();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  rejectProjectReq(ProdId){
      this.projectService.rejectProject(ProdId).subscribe(
        res => {
           this.getEmployeeDetailByEmail();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  getEmployeeDetailByEmail(){
    let reqData={
       // "email":"sc205@enovate-it.com"
        "email":"sohanchaudhary8080@gmail.com"
    }
    this.projectService.getEmpDetailApi({"reqData":reqData}).subscribe(
        res => {
           this.projectList=res.details.projects;
           this.MyProjectsList=res.details.MyProjects;
           this.AssignedProjectsList=res.details.AssignedProjects;
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
}
