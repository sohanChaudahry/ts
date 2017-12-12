import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GreenHouseService } from '../services/greenHouse.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { UserService } from '../services/user.service';
import { GreenHouseTypeService } from '../services/greenHouseType.service';
import {Popup} from 'ng2-opd-popup';

@Component({
  selector: 'app-greenHouse',
  templateUrl: './greenHouse.component.html',
  styleUrls: ['./greenHouse.component.scss']
})
  export class GreenHouseComponent implements OnInit {

  checkIdAvaiable='';
  greenHouse = {};
  greenHouses = [];
  userIds = [];
  user="";
  greenHousesActivities=[];
  greenHouseTypes = [];
  activityData=[{"day":1,"name":"sohan1","description":"Good one","start_date":"","status":"COMPLETED"}];
  isEditActivity=false; 
  isLoading = true;
  isEditing = false;
  message_list=[{"comment":"Good morning"},{"comment":"Good morning"},{"comment":"Good morning"},{"comment":"Good morning"},{"comment":"Good morning"},{"comment":"Good morning"}];
  //message_list=[];
  addGreenHouseForm: FormGroup;
  name = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  address = new FormControl('', Validators.required);
  users = new FormControl('', Validators.required);
  start_date = new FormControl('', Validators.required);
  greenHouseType = new FormControl('', Validators.required);
  
  constructor(private greenHouseService: GreenHouseService,
              private userService: UserService,
              private greenHouseTypeService:GreenHouseTypeService,              
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              private popup:Popup) { }

  ngOnInit() {
    this.getGreenHouses();
    this.getUsers();
    this.getGreenHouseTypes();
    this.addGreenHouseForm = this.formBuilder.group({
        name: this.name,
        owner:this.owner,
        address: this.address,
        users:this.users,
        start_date:this.start_date,
        greenHouseType:this.greenHouseType
     });
     this.popup.options = {
        header: "Activity's Comments",
        color: "#5cb85c", // red, blue....
        widthProsentage: 60, // The with of the popou measured by browser width
        animationDuration: 1, // in seconds, 0 = no animation
        showButtons: true, // You can hide this in case you want to use custom buttons
        confirmBtnContent: "Save", // The text on your confirm button
        cancleBtnContent: "Cancel", // the text on your cancel button
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    }
  }

  ClickButton(greenHouse) {
    let greenhouse_data=Object.assign({}, greenHouse);
    greenhouse_data.users = greenhouse_data.users._id ? greenhouse_data.users._id : greenhouse_data.users;
    greenhouse_data.greenHouseType = greenhouse_data.greenHouseType._id ? greenhouse_data.greenHouseType._id : greenhouse_data.greenHouseType;
    // this.activityData=Object.assign({}, activity);
    this.addGreenHouseForm.patchValue(greenhouse_data);
    // this.popup.show();
  }
  removeEditData() {
    this.addGreenHouseForm.patchValue({name:'',owner:'',address:'',users:'',greenHouseType:'',start_date:'',});
  }
  editActivityBtn(greenHouse){
    this.isEditActivity=true;
    //this.getGreenHousesActivities(greenHouse);
  }
  cancelEditActivity(){
    this.isEditActivity=false;
  }
  cancelDialog() {
      this.popup.hide();
  }
  viewCommnetsFunction(selected_activity){
    this.popup.show();
    //this.message_list=selected_activity.comments;
    // this.message_list={""};
  }
  getUsers() {
    this.userService.getUsers().subscribe(
      data =>{ 
        this.userIds = data.responseData;
        console.log(this.userIds);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getGreenHouses() {
    this.greenHouseService.getGreenHouses().subscribe(
      data => this.greenHouses = data.responseData,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  getGreenHousesActivities(greenHouse) {
    this.greenHouseService.getGreenHouseActivity(greenHouse._id).subscribe(
      data => this.greenHousesActivities = data.responseData[0],
      error => console.log(error)
    );
  }
  addGreenHouse() {
    console.log(this.addGreenHouseForm.value);
    this.greenHouseService.addGreenHouse({reqData:this.addGreenHouseForm.value}).subscribe(
      res => {
        console.log(res);
        const newType = res.responseData;
        if(newType){
          this.greenHouses.push(newType);
          this.addGreenHouseForm.reset();
          this.toast.setMessage('Green house added successfully.', 'success');
        }
      },
      error => console.log(error)
    );
  }

  editGreenHouse() {
    this.greenHouseService.editGreenHouse({reqData:this.addGreenHouseForm.value},this.checkIdAvaiable).subscribe(
      res => {
        const newType = res.responseData;
        if(newType){
            for(var i=0;i<=this.greenHouses.length;i++){
                if(this.greenHouses[i]._id==newType._id){
                    this.greenHouses.splice(i,1);
                    this.greenHouses.push(newType);
                    break;
                }
            }
            this.addGreenHouseForm.reset();
            this.checkIdAvaiable='';
            this.toast.setMessage('Green house edited successfully.', 'success');
        }
      },
      error => console.log(error)
    );
  }

  deleteGreenHouse(greenHouse) {
      this.greenHouseService.deleteGreenHouse(greenHouse).subscribe(
        res => {
          const pos = this.greenHouses.map(elem => elem._id).indexOf(greenHouse._id);
          this.greenHouses.splice(pos, 1);
          this.toast.setMessage('Green house deleted successfully.', 'success');
        },
        error => console.log(error)
      );
  } 

  getGreenHouseTypes() {
    this.greenHouseTypeService.getGreenHouseTypes().subscribe(
      data => this.greenHouseTypes = data.responseData,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
}
