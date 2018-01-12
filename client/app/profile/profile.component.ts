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
  type : string
}

interface requestData {
  title ?: string;
  description ?: string;
  picture  ?: string;
  employee_id ?: string;
  assets_id ?: string;
}

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('popup1') popup1: Popup;
  @ViewChild('popup2') popup2: Popup;

  settings = {
      bigBanner: true,
      timePicker: true,
      format: 'dd-MMM-yyyy hh:mm a',
      defaultOpen: false,
      closeOnSelect:false
  }
  asset_pagination={
    page:1,
    itemsPerPage:10,
    maxSize:5,
    numPages:5,
    length : 0,
  }
  history_pagination={
    page:1,
    itemsPerPage:10,
    maxSize:5,
    numPages:5,
    length : 0,
  }
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
  requestData:requestData = {
    title : "",
    description : "",
    picture  :"",
    employee_id :"" ,
    assets_id : ""
  }
  profileFormData: FormGroup;
  isLoading = false;
  assetList=[];
  selected_asset_detail="";
  name = new FormControl('', [Validators.required,]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  address = new FormControl('', [Validators.required]);
  type = new FormControl('', [Validators.required]);
  deleteAssetIndex=null;
  // roleList=["Employee","Manager","Super-Manager"];
  repairRequestHistory=[];
  typeList=[{"val":"E","name":"Employee"}];
  constructor(private toast :ToastComponent,
  private formBuilder: FormBuilder,
  private projectService :ProjectService,
  private profileService:ProfileService) { 
    
  }
  ngOnInit() {
    this.getEmployeeDetailByEmail();
    this.getAssetList();
    this.getRepairRequestHistory();
      this.profileFormData = this.formBuilder.group({
          name: this.name,
          email: this.email,
          address: this.address,
          type : this.type,
          _id : localStorage.getItem("_id") ? localStorage.getItem("_id") : ""
      });
  }
  openRepairRequestDialog(asset_detail){
    this.requestData={
      title : "",
      description : "",
      picture  :"",
      employee_id :"" ,
      assets_id : ""
    }
    this.popup1.options = {
        header: "Repair Request",
        widthProsentage: 40, // The with of the popou measured by browser width 
        animationDuration: 1, // in seconds, 0 = no animation 
        showButtons: true, // You can hide this in case you want to use custom buttons 
        confirmBtnContent: "OK", // The text on your confirm button 
        cancleBtnContent: "Cancel", // the text on your cancel button 
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button 
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
    };
    this.selected_asset_detail=asset_detail._id;
    this.popup1.show(this.popup1.options);
  }
  conformRequestPopup(){
    var reqData={
      "title" : this.requestData.title,
      "description" : this.requestData.description,
      "picture" : "www.google.com",
      "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
      "assets_id":this.selected_asset_detail ? this.selected_asset_detail :""
    }
    this.profileService.saveRepairRequest({'reqData':reqData}).subscribe(
        res => {
         console.log(res);
         this.popup1.hide();
         this.getRepairRequestHistory();
         this.toast.setMessage('Repair request send successfully!', 'success');
        },
        error => this.toast.setMessage('Some thing wrong!', 'danger')
    );
  }
  cancelRequestPopup(){
    this.popup1.hide();
  }
  addAssetRow(){
    let asset_detail : aasetFormData = {
      assets_id : "",
      assets_name : "",
      description : "",
      employee_id : localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
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
  deleteAssetDialog(asset_detail,index){
    this.popup2.options = {
        header: "Delete Assets",
        widthProsentage: 40, // The with of the popou measured by browser width 
        animationDuration: 1, // in seconds, 0 = no animation 
        showButtons: true, // You can hide this in case you want to use custom buttons 
        confirmBtnContent: "OK", // The text on your confirm button 
        cancleBtnContent: "Cancel", // the text on your cancel button 
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button 
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
    };
    this.selected_asset_detail=asset_detail._id;
    this.deleteAssetIndex=index;
    this.popup2.show(this.popup2.options);
  }
  conformDeleteAssetPopup(){
    console.log(this.selected_asset_detail);
    if(this.selected_asset_detail && this.selected_asset_detail!="" && this.selected_asset_detail!=undefined){
      this.profileService.deleteAssets(this.selected_asset_detail).subscribe(
          res => {
          console.log(res);
          this.popup2.hide();
          this.getAssetList();
          this.toast.setMessage('Asset delete successfully!', 'success');
          },
          error => this.toast.setMessage('Some thing wrong!', 'danger')
      );
    }else{
      this.popup2.hide();
      this.assetList.splice(this.deleteAssetIndex,1);
      this.toast.setMessage('Asset delete successfully!', 'success');
    }
  }
  cancelDeleteAssetPopup(){
    this.popup2.hide();
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
  getRepairRequestHistory(page?:any){
    let reqData={
      "employee_id":localStorage.getItem("_id") ? localStorage.getItem("_id") : "",
      "page" : page ? page.page : 1,
      "limit": this.asset_pagination.itemsPerPage ? this.asset_pagination.itemsPerPage : 10
    }
    this.profileService.get_repair_request_history({"reqData":reqData}).subscribe(
      res => {
        if(res){
          this.repairRequestHistory= res.repairRequestList;  
          console.log(res);  
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
}
