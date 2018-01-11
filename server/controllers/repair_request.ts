import employees_model from '../models/employees';
import assets_model from '../models/assets';
import repair_request_model from '../models/repair_request';

var async = require("async");
var moment=require("moment");
const mongoose = require('mongoose');


export default class RepairRequestCtrl  {

    saveRepairRequest = (req, res) => {
        var repairRequestList=req.body.reqData;
        var resData={};
        if(repairRequestList){
            var new_repair_request=new repair_request_model();
            new_repair_request.title=repairRequestList.title ? repairRequestList.title : "";
            new_repair_request.description=repairRequestList.description ? repairRequestList.description : "";
            new_repair_request.picture=repairRequestList.picture ? repairRequestList.picture : "";
            new_repair_request.status=repairRequestList.status ? repairRequestList.status : 0;
            new_repair_request.employee_id=repairRequestList.employee_id ? repairRequestList.employee_id : "";
            new_repair_request.assets_id=repairRequestList.assets_id ? repairRequestList.assets_id : "";
            new_repair_request.created_date=repairRequestList.created_date ? new Date(repairRequestList.created_date) : new Date();
            new_repair_request.modify_date=repairRequestList.modify_date ? new Date(repairRequestList.modify_date) : new Date();

            new_repair_request.save(function (err) {
                if (err) {
                  resData['error'] = err;  
                  res.send(resData);
                }else {
                   resData['success'] = "true";  
                   res.send(resData);
                }
            });
        }
    }
    getRepairRequestHistory = (req,res) => {
        var request_detail=req.body.reqData;
        var resData={
            repairRequestList :[]
        };
        if(request_detail){
            var employee_id = mongoose.Types.ObjectId(request_detail.employee_id);
            repair_request_model.paginate({"employee_id": employee_id}, {page : request_detail.page, limit: request_detail.limit }, function(err, data){
            // repair_request_model.find({ "employee_id": employee_id }, function (err, data) {
                if(data){
                    res['success']='ture';
                    resData.repairRequestList=data.docs;
                    res.send(resData);
                }else{
                    res['error']=err;
                    res.send(resData);
                }
            });
        }
    }
}