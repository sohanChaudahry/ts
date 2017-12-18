import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';

interface taskFormData {
  task_title : string;
  task_description : string;
  assign_from ? : any;
  assign_to : any;
  project_id : any;
  activity_id : any;
  due_date : Date;
  priority : string;
  estimate_hrs : number;
  actual_hrs ? : number;
  status ? : number;
  select ? : number;
  start_date_time ? : Date;
  end_date_time ? : Date;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  isListTask=true;
  isEditTask=false;
  isEditOtherTask=false;
  public employeesToshow  :Array<any>=[];
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  projectList=[];
  employeesList=[];
  activityList=[];
  AssigedToOtherList=[];
  getTaskAssigedToUsList=[];
  statusList=[{"val":0,"name":"Assigned"},{"val":1,"name":"In Progress"},{"val":2,"name":"Completed"},{"val":3,"name":"Failed"}];
  priorityList=["P0","P1","P2","P3","P4","P5"];
  date: Date = new Date();
  settings = {
    bigBanner : true,
    timePicker : false,
    format : 'dd-MM-yyyy',
    defaultOpen : true
  }
   taskFormDetail : taskFormData = {
     task_title :"",
     task_description : "",
     assign_from:"",
     assign_to : "",
     project_id : "",
     activity_id : "",
     due_date : new Date(),
     priority : "",
     estimate_hrs : null,
     actual_hrs  : null,
     status : null,
     select : null,
     start_date_time : new Date(),
     end_date_time : new Date(),
   };
  //getTaskForm: FormGroup;
  // task_title = new FormControl('', Validators.required);
  // task_description = new FormControl('', Validators.required);
  // assign_from = new FormControl('', Validators.required);
  // assign_to = new FormControl('', Validators.required);
  // project_id = new FormControl('', Validators.required);
  // activity_id = new FormControl('', Validators.required);
  // due_date = new FormControl('', Validators.required);
  // priority = new FormControl('', Validators.required);
  // estimate_hrs =  new FormControl('', Validators.required);

  constructor(public toast:ToastComponent,
  private projectService : ProjectService,
  private taskService: TaskService,
  private formBuilder:FormBuilder) {

   }

  ngOnInit() {
     this.getEmployeeDetailByEmail();
     this.getAllEmployeeList();
     this.getTaskAssigedFrom();
     this.getTaskAssigedToUs();
    //  this.getTaskForm = this.formBuilder.group({
    //       task_title: this.task_title,
    //       task_description:this.task_description,
    //       assign_from: this.assign_from,
    //       assign_to:this.assign_to,
    //       project_id:this.project_id,
    //       activity_id:this.activity_id,
    //       due_date:this.due_date,
    //       priority:this.priority,
    //       estimate_hrs : this.estimate_hrs
    //  });
  }
  private get disabledV():string {
    return this._disabledV;
  }
 
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
  resetFormValue(){
    this.taskFormDetail={
        task_title :"",
        task_description : "",
        assign_from:"",
        assign_to : "",
        project_id : "",
        activity_id : "",
        due_date : new Date(),
        priority : "",
        estimate_hrs : null,
        actual_hrs  : null,
        status : null,
        select : null,
        start_date_time : new Date(),
        end_date_time : new Date(),
    }
  }
  public selected(value:any):void {
    let selectAssignId="";
    this.taskFormDetail.assign_to="";
    for(var i=0;i<this.employeesList.length;i++){
        if(value.text==this.employeesList[i].name){
            selectAssignId=this.employeesList[i]._id;
        }
    }
    this.taskFormDetail.assign_to=selectAssignId;
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

  taskEditBtm() {
      this.isListTask=false;
      this.isEditTask=true;
      this.isEditOtherTask=false;
      this.resetFormValue();
  }
  editAssignedTaskBtn(selectedData) {
      this.taskFormDetail=selectedData;
      this.isListTask=false;
      this.isEditTask=true;
      this.isEditOtherTask=false;
  }
  cancel() {
      this.isListTask=true;
      this.isEditTask=false;
      this.isEditOtherTask=false;
  }
  editAssignTaskOtherBtn(selectedData){
      this.taskFormDetail=selectedData;
      this.isListTask=false;
      this.isEditTask=false;
      this.isEditOtherTask=true;
  }
  cancelOther(){
      this.isListTask=true;
      this.isEditTask=false;
      this.isEditOtherTask=false;
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
  getEmployeeDetailByEmail() {
      let reqData={
          "email":"sc205@enovate-it.com"
      }
      this.projectService.getEmpDetailApi({"reqData":reqData}).subscribe(
          res => {
            this.projectList=res.details.projects;
          },
          error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  //apne bija ne assign kariye 
  getTaskAssigedFrom(){
      let id="5a2f9e69d261962aff5725c7";
      this.taskService.getTaskAssigedFrom(id).subscribe(
          res => {
            this.AssigedToOtherList=res.tasks;
          },
          error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  getTaskAssigedToUs(){  
      let id="5a2f9e69d261962aff5725c7";
      this.taskService.getTaskAssigedToUs(id).subscribe(
          res => {
            this.getTaskAssigedToUsList=res.tasks;
          },
          error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
   }
   changeProjectOption(data){
     console.log(data);
     this.taskFormDetail.activity_id="";
     this.activityList=[];
     this.getProjectDetailById(data);
   }
   getProjectDetailById(ProdId){
      this.taskService.getProjectDetailById(ProdId).subscribe(
        res => {
           this.activityList=res.activities;
           console.log(this.activityList);
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
  saveTaskDetail(){
    //test
    this.taskFormDetail.assign_from="5a2f9e69d261962aff5725c7";
    console.log(this.taskFormDetail);
    this.taskService.saveTaskDetail({reqData:[this.taskFormDetail]}).subscribe(
      res => {
          this.toast.setMessage('Task add successfully!', 'success');
          this.isListTask=true;
          this.isEditTask=false;
          this.isEditOtherTask=false;
          this.activityList=[];
          this.getTaskAssigedFrom();
          this.getTaskAssigedFrom();
      },
      error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  saveOthersTask(selectedData){
      //test
      console.log(this.taskFormDetail);
      this.taskService.saveTaskDetail({reqData:[this.taskFormDetail]}).subscribe(
        res => {
            this.toast.setMessage('Task add successfully!', 'success');
            this.isListTask=true;
            this.isEditTask=false;
            this.isEditOtherTask=false;
            this.activityList=[];
            this.resetFormValue();
            this.getTaskAssigedToUs();
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
  }
}
