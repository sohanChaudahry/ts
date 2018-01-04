import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employeeList=[{"name":"Employee 1"},{"name":"Employee 2"},{"name":"Employee 3"}];
  isLoading=false;
  constructor(public toast: ToastComponent) { }

  ngOnInit() {
  }
 
}
