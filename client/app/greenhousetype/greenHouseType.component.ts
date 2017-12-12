import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GreenHouseTypeService } from '../services/greenHouseType.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {Popup} from 'ng2-opd-popup';
import { ActivitiesService } from '../services/activities.services';



@Component({
  selector: 'app-greenHousetype',
  templateUrl: './greenHouseType.component.html',
  styleUrls: ['./greenHouseType.component.scss']
})
  export class GreenHouseTypeComponent implements OnInit {


  checkIdAvaiable='';
  greenHouseType = {};
  greenHouseTypes = [];
  isLoading = true;
  isEditActivity = false;
  isEditing=false;
  activityData=[];
  swapEndDays;
  selectedActivityData={};
  statusList=[{"status":"CREATED"},{"status":"COMPLETED"},{"status":"INCOMPLETE"}];
  addGreenHouseTypeForm: FormGroup;
  type = new FormControl('', Validators.required);
  days = new FormControl('', Validators.required);
  // start_date = new FormControl('', Validators.required);

  constructor(private greenHouseTypeService: GreenHouseTypeService,
      private formBuilder: FormBuilder,
      private activitiesService: ActivitiesService,
      public toast: ToastComponent,
      private popup:Popup) { }

  ngOnInit() {
    this.getGreenHouseTypes();
    this.addGreenHouseTypeForm = this.formBuilder.group({
        type: this.type,
        days: this.days
        // start_date:this.start_date
     });

     this.popup.options = {
        header: "Add new activities",
        color: "#5cb85c", // red, blue....
        widthProsentage: 70, // The with of the popou measured by browser width
        animationDuration: 1, // in seconds, 0 = no animation
        showButtons: false, // You can hide this in case you want to use custom buttons
        confirmBtnContent: "Save", // The text on your confirm button
        cancleBtnContent: "Cancel", // the text on your cancel button
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    }
  }

  editActivityBtn(editData){
      this.isEditActivity=true;
      this.selectedActivityData=editData;
      //this.addGreenHouseTypeForm.patchValue(editData);
      this.greenHouseTypeService.getActivityById(editData).subscribe(
          data =>{
             this.activityData=data.resData;
             this.swapEndDays=Array.apply(null,{length:editData.days});
             if(this.activityData.length==0){
                this.activityData.push({"day":1,"name":'',"description":'',"greenHouseTypeId":editData._id});
             }
          },
          error => console.log(error)
      );
  }
  editGreenHouseTypeBtn(editData){
     this.addGreenHouseTypeForm.patchValue(editData);
     this.isEditing=false;
     this.isEditActivity=false;
  }
  cancelEditActivity(){
    this.isEditActivity=false;
    this.activityData=[];
  }
  removeEditData(){
    this.addGreenHouseTypeForm.patchValue({type:'',days:'',users:'',greenHouseType:'',register_date:''});
  }
  addActivityEditRow(){
    this.activityData.push({"day":null,"name":'',"description":'',"greenHouseTypeId":this.activityData[0]._id});
    console.log(this.activityData);
  }
  openDialog(){
    this.popup.show();
  }

  cancelDialog(){
    this.popup.hide();
  }
  
  getGreenHouseTypes() {
    this.greenHouseTypeService.getGreenHouseTypes().subscribe(
      data =>{ 
        this.greenHouseTypes = data.responseData
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  updateGreenHouseType() {
    console.log(this.addGreenHouseTypeForm.value);
    this.greenHouseTypeService.updateGreenHouseType({reqData:this.addGreenHouseTypeForm.value},this.checkIdAvaiable).subscribe(
      res => {
        console.log(res);
        const newType = res.responseData;
        if(newType){
            for(var i=0;i<this.greenHouseTypes.length;i++){
                if(this.greenHouseTypes[i]._id==newType._id){
                    this.greenHouseTypes.splice(i,1);
                    this.greenHouseTypes.push(newType);
                    break;
                }
            }
            this.checkIdAvaiable='';
            this.addGreenHouseTypeForm.reset();
            this.toast.setMessage('Green house type added successfully.', 'success');
        }else{
          if(newType.errors.length!=0){
              this.toast.setMessage(newType.errors[0].message, 'danger');
          }
        }
      },
      error => console.log(error)
    );
  }

  addActivities() {
      if(this.activityData && this.activityData.length!=0){
          for(var i=0;i<this.activityData.length;i++){
              if(this.activityData[i].name=='' ){
                    this.toast.setMessage('Name shuold not be blank!', 'danger');
                    return 0;
              }else if(this.activityData[i].description==''){
                    this.toast.setMessage('Description shuold not be blank!', 'danger');
                    return 0;
              }else if(this.activityData[i].day==null || this.activityData[i].day==''){
                    this.toast.setMessage('Day shuold not be blank!', 'danger');
                    return 0;
            }
          }
      }
      this.greenHouseTypeService.addActivitiesApi({reqData:this.activityData}).subscribe(
        res => {
          const newCat = res;
          if(newCat.responseData && !newCat.errors){
              this.toast.setMessage('Activity added successfully.', 'success');
              this.cancelDialog();
          }else {
              if(newCat.errors.length!=0){
                for(var i=0;i<newCat.errors.length;i++){
                    this.toast.setMessage(newCat.errors[i].message, 'danger');
                }
              }
          }
        },
        error => console.log(error)
      );
  }
  
  addGreenHouseType() {
    console.log(this.addGreenHouseTypeForm.value);
    this.greenHouseTypeService.addGreenHouseType({reqData:this.addGreenHouseTypeForm.value}).subscribe(
      res => {
        console.log(res);
        const newType = res;
        if(newType.responseData){
            this.greenHouseTypes.push(newType.responseData);
            this.addGreenHouseTypeForm.reset();
            this.toast.setMessage('Type added successfully.', 'success');
        }else{
          if(newType.errors.length!=0){
              this.toast.setMessage(newType.errors[0].message, 'danger');
          }
        }
      },
      error => console.log(error)
    );
  }

  deleteGreenHouseType(greenHouseType) {
      this.greenHouseTypeService.deleteGreenHouseType(greenHouseType).subscribe(
        res => {
          const pos = this.greenHouseTypes.map(elem => elem._id).indexOf(greenHouseType._id);
          this.greenHouseTypes.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
}
