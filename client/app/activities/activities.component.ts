import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ActivitiesService } from '../services/activities.services';
import { ToastComponent } from '../shared/toast/toast.component';
import { GreenHouseTypeService } from '../services/greenHouseType.service';
import {Popup} from 'ng2-opd-popup';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activity = {};
  activities = [];
  greenHouseTypes = [];
  activityData={};
  isLoading = true;
  isEditing = false;
  isEditComment=false;
  sendMessage='';
  message_list=[]
  statusList=[{"status":"CREATED"},{"status":"COMPLETED"},{"status":"INCOMPLETEs"}];
  activitiesForm: FormGroup;
  day = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  comment = new FormControl('',Validators.required);
  greenHouseTypeId =new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);

  constructor(private activitiesService: ActivitiesService,
              private greenHouseTypeService:GreenHouseTypeService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              private popup:Popup) { }

  ngOnInit() {
    this.getActivities();
    this.getGreenHouseTypes();
    this.activitiesForm = this.formBuilder.group({
      date: this.date,
      day: this.day,
      name: this.name,
      status: this.status,
      description: this.description,
      comment:this.comment,
      greenHouseTypeId:this.greenHouseTypeId
    });

    this.popup.options = {
        header: "Edit activities",
        color: "#5cb85c", // red, blue....
        widthProsentage: 70, // The with of the popou measured by browser width
        animationDuration: 1, // in seconds, 0 = no animation
        showButtons: false, // You can hide this in case you want to use custom buttons
        confirmBtnContent: "Save", // The text on your confirm button
        cancleBtnContent: "Cancel", // the text on your cancel button
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown',
        
    }
  }

  getGreenHouseTypeId(greenHouseTypeId){
     this.greenHouseTypeId=greenHouseTypeId;
  }

  getActivities() {
    this.activitiesService.getActivities().subscribe(
      data => {
        this.activities = data.responseData
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getGreenHouseTypes() {
    this.greenHouseTypeService.getGreenHouseTypes().subscribe(
      data => this.greenHouseTypes = data.responseData,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  sendCommnet(msg){
    this.message_list.push({"msg":msg});
    this.sendMessage='';
  }
  // addActivities() {
  //   this.activitiesForm.value.greenHouseTypeId=this.activitiesForm.value.greenHouseTypeId._id;
  //   this.activitiesService.addActivities(this.activitiesForm.value).subscribe(
  //     res => {
  //       const newCat = res.json();
  //       this.activities.push(newCat);
  //       this.activitiesForm.reset();
  //       this.toast.setMessage('item added successfully.', 'success');
  //     },
  //     error => console.log(error)
  //   );
  // }

  editActivityDialog(activity) {
     this.popup.show();
     activity.greenHouseTypeId=activity.greenHouseTypeId._id ?activity.greenHouseTypeId._id :activity.greenHouseTypeId;
     this.activityData=Object.assign({}, activity);
  }
  cancelDialog() {
      this.popup.hide();
      // this.activityData={};
  }
  cancelEditing() {
    this.isEditing = false;
    this.activity = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getActivities();
  }

  editActivity() {
    this.activitiesService.editActivities(this.activityData).subscribe(
      res => {
        this.isEditing = false;
        if(res.responseData){
          for(var i;i<=this.activities.length;i++){
              if(this.activityData[i]._id==res.responseData._id){
                  this.activities.splice(i,1);
                  this.activities.push(res.responseData);
                  break;
              }
          }
          this.cancelDialog();
          this.toast.setMessage('item edited successfully.', 'success');
        }
      },
      error => console.log(error)
    );
  }
  viewCommnetsFunction(activity){
    this.isEditComment=true;
    this.message_list=activity.comments;
  }
  deleteActivities(activity) {
      this.activitiesService.deleteActivities(activity).subscribe(
        res => {
          const pos = this.activities.map(elem => elem._id).indexOf(activity._id);
          this.activities.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
}