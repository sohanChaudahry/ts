import { Component, OnInit, ViewChild  } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ProfileService } from '../services/profile.service';

import {Popup} from 'ng2-opd-popup';

interface profileFormData {
  name : string;
  email : string;
  address  : string;
  // type : string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  settings = {
      bigBanner: true,
      timePicker: true,
      format: 'dd-MMM-yyyy hh:mm a',
      defaultOpen: false,
      closeOnSelect:false
  }
  asset_pagination={
    page:1,
    itemsPerPage:1,
    maxSize:5,
    numPages:5,
    length : 0,
  }
  profileFormData: FormGroup;
  isLoading = false;
  assetList=[];
  name = new FormControl('', [Validators.required,]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  address = new FormControl('', [Validators.required]);

  typeList=[{"val":"E","name":"Employee"}];
  constructor(private toast :ToastComponent,
  private formBuilder: FormBuilder,
  private projectService :ProjectService,
  private profileService:ProfileService) { 
    
   }

  ngOnInit() {
    this.getEmployeeDetailByEmail();
    this.getAssetList();
      this.profileFormData = this.formBuilder.group({
          name: this.name,
          email: this.email,
          address: this.address,
          // type:this.type,
          _id : localStorage.getItem("_id") ? localStorage.getItem("_id") : ""
      });
  }

  saveProfile(){
    console.log(this.profileFormData.value);
    this.profileService.saveProfile({"reqData":[this.profileFormData.value]}).subscribe(
        res => {
          if(res.success.successData.length!=0){
             this.profileFormData.patchValue(res.success);
             this.toast.setMessage("Profile successfully updated", 'success')
          }else if(res.failed.failedData.length!=0){
             this.toast.setMessage(res.failed.failedData[0].error, 'danger')
          }
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  getEmployeeDetailByEmail(){
    let reqData={
        "email":localStorage.getItem("email") ? localStorage.getItem("email") : ""
    }
    this.projectService.getEmpDetailApi({"reqData":reqData}).subscribe(
        res => {
            this.profileFormData.patchValue(res.details);
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  getAssetList(page?:any){
    let reqData={
        "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
        "page" : page ? page.page : 1,
        "limit": this.asset_pagination.itemsPerPage ? this.asset_pagination.itemsPerPage : 10
    }
    this.profileService.getAssetList({"reqData":reqData}).subscribe(
        res => {
            this.assetList=res.assetList.docs;
            this.asset_pagination.length=res.assetList.total;
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
}
