import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employeeList=[];
  MyProjectsList=[];
  AssignedProjectsList=[];
  isLoading=false;
  isEmployeeListShow=true;
  isProjectListShow=false;
  selectedEmployee={};

  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 5;
  public length:number = 0;

  constructor(public toast: ToastComponent,
  private employeeService : EmployeeService) { 
  }

  ngOnInit() {
    this.getEmployeeDetailAllData();
  }
 
  public getEmployeeDetailAllData(page?:any){
    let reqData={
      "page" : page ? page.page : 1,
   	  "limit" : this.itemsPerPage
   }
   this.employeeService.getAllEmployeeDetailswithPagination({"reqData":reqData}).subscribe(
       res => {
          this.employeeList=res.employees;
          this.length=res.Total;
          // this.page=res.Pages;
       },
       error => this.toast.setMessage('Some thing wrong!', 'danger')
   );
  }

  openProjectListDialog(emp){
    this.selectedEmployee=emp.email;
    this.isEmployeeListShow=false;
    this.isProjectListShow=true;
    this.getEmployeeDetailAllDataProject();
  }
  backEmpListPage(){
    this.isEmployeeListShow=true;
    this.isProjectListShow=false;
  }
  getEmployeeDetailAllDataProject(page ? :any){
    let reqData={
      "email": this.selectedEmployee,
      "page" : page ? page.page : 1,
      "limit" : this.itemsPerPage
   }
   this.employeeService.getdetailsByEmailwithPagination({"reqData":reqData}).subscribe(
       res => {
          this.MyProjectsList=res.details.MyProjects;
          this.AssignedProjectsList=res.details.AcceptedProjects;
       },
       error => this.toast.setMessage('Some thing wrong!', 'danger')
   );
  }
}
