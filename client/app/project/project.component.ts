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


  public items:Array<string> = [];
  public employeesToshow  :Array<string>=[];
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  isLoading=false;
  employeesList=[];
  projectList=[];
  roleList=["Manager","Developer","Tester"];
  addAssignUserList=[{"name":"sohan","role":"Manager"},{"name":"sohan","role":"Manager"},{"name":"sohan","role":"Manager"},{"name":"sohan","role":"Manager"},{"name":"sohan","role":"Manager"},{"name":"sohan","role":"Manager"}];
  activityData=[{"name":""}];
  
  getProjectForm: FormGroup;
  project_id = new FormControl('');
  project_name = new FormControl('', Validators.required);
  role = new FormControl('', Validators.required);
  desc = new FormControl('', Validators.required);
  email = new FormControl('');
  activities = new FormControl([]);
  assign_to = new FormControl([]);

  projectDetail={
      "project_id":"",
      "project_name":"",
      "role":"",
      "desc":"",
      "email":"",
      "activities":[],
      "assign_to":[]
  };

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
    this.activityData.push({"name":""});
  }
  removeActivity(index){   
      this.activityData.splice(index,1);
      if(this.activityData.length==0){
          this.addActivity();
      }
  }
  cancel(){
    this.activityData=[{"name":""}];
    this.getProjectForm.reset();
  }
  sendProjectFormData(Data){
    this.projectDetail.activities=this.activityData;
    console.log(this.projectDetail);
  }
  getAllEmployeeList() {
      this.projectService.getAllEmployee().subscribe(
        res => {
           let data=res;
           this.employeesList=res.employees;
           for(var i=0;i<this.employeesList.length;i++){
               this.employeesToshow.push(this.employeesList[i].name);
               this.items.push(this.employeesList[i].name);
           }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  getEmployeeDetailByEmail(){
    let reqData={
        "email":"sc205@enovate-it.com"
    }
    this.projectService.getEmpDetailApi({"reqData":reqData}).subscribe(
        res => {
           this.projectList=res;
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
}
