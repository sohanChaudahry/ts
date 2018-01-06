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
  constructor(public toast: ToastComponent,
  private employeeService : EmployeeService) { }

  ngOnInit() {
    this.getEmployeeDetailAllData();
  }
 
  getEmployeeDetailAllData(){
    let reqData={
      "page" : 1,
   	  "limit" : 20
   }
   this.employeeService.getAllEmployeeDetailswithPagination({"reqData":reqData}).subscribe(
       res => {
        this.employeeList=res.employees;
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
  getEmployeeDetailAllDataProject(){
    let reqData={
      "email": this.selectedEmployee,
      "page" : 1,
   	  "limit" : 20
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
