
import employeesModel from '../models/employees';
import assetsModel from '../models/assets';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');


export default class AssetsCtrl  {

 /*
  @author : Sohan chaudhary 
  @date : 11 Jan 2018
  @API : save_update_assets
  @desc :Save and update task details and select task.
  */
  save_update_assets = (req, res) => {
        
    var assetsList=req.body.reqData;
    var length=assetsList.length;
    var count=0;
    var successData = {
        successData : []
    }
    var failedData = {
        failedData : []
    }
    async.each(assetsList, function(asset, callback) {
       
        if( asset && asset._id!=undefined && asset._id!=''  && asset._id!=null) {
            var _idstatus = mongoose.Types.ObjectId.isValid(asset._id);
            if (_idstatus == false) {
                count=count + 1;
                var err = asset._id + ' Asset Id is invalid';    
                asset.error = err;           
                failedData.failedData.push(asset);
                callback();
            }else{
                var asset_id = mongoose.Types.ObjectId(asset._id);
                assetsModel.find({ "_id": asset_id }, function (err, data1) {
                    if(data1 && data1.length>0){
                        //update asset
                        assetsModel.findOneAndUpdate({ "_id": asset._id },{ "$set": { 
                            "assets_id":asset.assets_id ? asset.assets_id : "",
                            "assets_name":asset.assets_name ? asset.assets_name : "",
                            "description":asset.description ? asset.description : "",
                            "employee_id":asset.employee_id ? asset.employee_id : "",
                            "manufacturer":asset.manufacturer ? asset.manufacturer : "",
                            "rented":asset.rented ? asset.rented : "",
                            "serical_no":asset.serical_no ? asset.serical_no : "",
                         }}).exec(function(err,data2){
                            if (err){
                                console.log(data2);
                                count=count + 1;
                                asset.error = err;                                       
                                failedData.failedData.push(asset);
                                callback();
                            }else{
                                console.log(data2);
                                count=count + 1;
                                asset.success = "true";
                                successData.successData.push(asset);
                                callback();
                            }
                        });
                    }
                });
            }
        }else{
             //new asset
             var new_asset = new assetsModel();
             new_asset.assets_id=asset.assets_id;
             new_asset.assets_name=asset.assets_name;
             new_asset.description=asset.description;
             new_asset.employee_id=asset.employee_id;
             new_asset.manufacturer=asset.manufacturer;
             new_asset.rented=asset.rented;
             new_asset.serical_no=asset.serical_no;
             new_asset.save(function (err) {
                 if (err) {
                   asset.error = err;    
                   failedData.failedData.push(asset);
                   count=count + 1;
                   callback();
                 }else {
                    asset.success = "true";
                    successData.successData.push(asset);
                    count=count + 1;
                    callback();
                 }
             });
        }
        
    }, function(err) {
        var result = {};
        result['success'] = successData;
        result['failed'] = failedData;
        if(count >= length){
            res.send(result);
        }  
        return;
    });
  }
 /*
  @author : Sohan chaudhary 
  @date : 11 Jan 2018
  @API : save_update_assets
  @desc :Save and update task details and select task.
  */
  deleteAsset = (req, res) => {  
    var asset_detail = req.params.id;
    var asset_id = mongoose.Types.ObjectId(asset_detail);
    var _idstatus = mongoose.Types.ObjectId.isValid(asset_id);
    if(asset_detail && asset_id && _idstatus){
        var resData = {};  
        assetsModel.remove({ "_id" : asset_id}, function(err){
            if (err) {
                resData["error"] = err;
                res.send(resData);
            }else{
                resData["success"] = true;
                res.send(resData);
            }
        })
    }else{
        resData["error"] = "Some thing wrong !";
        res.send(resData);
    }
  }

  getAssetByEmpId = (req,res) => {
    var request_detail=req.body.reqData;
    var resData={
        assetList :[]
    };
    if(request_detail){
        var employee_id = mongoose.Types.ObjectId(request_detail.employee_id);
        assetsModel.paginate({"employee_id": employee_id}, {page : request_detail.page, limit: request_detail.limit }, function(err, data){
        // repair_request_model.find({ "employee_id": employee_id }, function (err, data) {
            if(data){
                res['success']='ture';
                resData.assetList=data;
                res.send(resData);
            }else{
                res['error']=err;
                res.send(resData);
            }
        });
    }
}
}