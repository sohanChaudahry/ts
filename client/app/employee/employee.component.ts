import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { EmployeeService } from '../services/employee.service';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';

interface aasetFormData {
  assets_id ?: string
  assets_name ?: string,
  description ?: string,
  employee_id ?: string,
  manufacturer ?:string,
  rented?:1,
  serical_no?:string,
  isAssetEdit?:1
}
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
  isAssetsListShow=false;
  selectedEmployee={};
  selected_employee_id='';
  assetList=[];
  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 5;
  public length:number = 0;
  aasetFormData : aasetFormData = {
    assets_id : "",
    assets_name : "",
    description : "",
    employee_id : "",
    manufacturer:"",
    rented:1,
    serical_no:"",
    isAssetEdit:1
  };
  asset_pagination={
    page:1,
    itemsPerPage:10,
    maxSize:5,
    numPages:5,
    length : 0,
  }
  constructor(public toast: ToastComponent,
  private employeeService : EmployeeService,
  private profileService : ProfileService,
  private authService :AuthService) { 
  }

  ngOnInit() {
    this.getEmployeeDetailAllData();
    console.log(this.authService.user_type);
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
    this.isAssetsListShow=false;
    this.getEmployeeDetailAllDataProject();
  }
  backEmpListPage(){
    this.isEmployeeListShow=true;
    this.isAssetsListShow=false;
    this.isProjectListShow=false;
  }
  
  openAssetDialog(selected_employee){
    this.isEmployeeListShow=false;
    this.isAssetsListShow=true;
    this.isProjectListShow=false;
    this.selected_employee_id=selected_employee._id;
    this.getAssetList();
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
  getAssetList(page?:any){
    let reqData={
        "employee_id":this.selected_employee_id ? this.selected_employee_id : "",
        "page" : page ? page.page : 1,
        "limit": this.asset_pagination.itemsPerPage ? this.asset_pagination.itemsPerPage : 10
    }
    this.profileService.getAssetList({"reqData":reqData}).subscribe(
        res => {
            this.assetList=res.assetList.docs;
            if(this.assetList.length!=0){
              for(var i=0;i<this.assetList.length;i++){
                this.assetList[i].isAssetEdit=0;
              }
            }
            this.asset_pagination.length=res.assetList.total;
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  addAssetRow(){
    let asset_detail : aasetFormData = {
      assets_id : "",
      assets_name : "",
      description : "",
      employee_id : this.selected_employee_id ? this.selected_employee_id : "",
      manufacturer:"",
      rented:1,
      serical_no:"",
      isAssetEdit:1
    };
    this.assetList.push(asset_detail);
  }
  updateAsset(index){
      this.assetList[index].isAssetEdit=1;
  }
  saveAssetDetail(){
    var reqData={
      "reqData":this.assetList
    };
    this.profileService.saveAssetDetail(reqData).subscribe(
        res => {
          if(res && res.failed.failedData.length==0){
            this.getAssetList();
            this.toast.setMessage('Assets saved successflly!', 'success');
          }else if(res.failed.failedData.length>0){
            this.toast.setMessage('Assets not saved.!', 'danger');
          }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  // deleteAssetDialog(asset_detail){
  //   this.popup2.options = {
  //       header: "Repai Request",
  //       widthProsentage: 40, // The with of the popou measured by browser width 
  //       animationDuration: 1, // in seconds, 0 = no animation 
  //       showButtons: true, // You can hide this in case you want to use custom buttons 
  //       confirmBtnContent: "OK", // The text on your confirm button 
  //       cancleBtnContent: "Cancel", // the text on your cancel button 
  //       confirmBtnClass: "btn btn-default", // your class for styling the confirm button 
  //       cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
  //       animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
  //   };
  //   this.selected_asset_detail=asset_detail._id;
  //   this.popup2.show(this.popup2.options);
  // }
}
