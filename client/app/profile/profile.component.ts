import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ProfileService } from '../services/profile.service';

interface profileFormData {
  name : string;
  email : string;
  address  : string;
  type : string;
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

  profileFormData: FormGroup;
  isLoading = false;
  name = new FormControl('', [Validators.required,]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  address = new FormControl('', [Validators.required]);
  type = new FormControl('', [ Validators.required]);

  typeList=[{"val":"E","name":"Employee"}];
  constructor(private toast :ToastComponent,
  private formBuilder: FormBuilder,
  private projectService :ProjectService,
  private profileService:ProfileService) { 
    
   }

  ngOnInit() {
    this.getEmployeeDetailByEmail();
      this.profileFormData = this.formBuilder.group({
          name: this.name,
          email: this.email,
          address: this.address,
          type:this.type,
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
}
