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
            repairRequestList:[]
        };
        if(request_detail){
            var employee_id = mongoose.Types.ObjectId(request_detail.employee_id);
            if(request_detail.assets_id){
                var assets_id = mongoose.Types.ObjectId(request_detail.assets_id);
            }
            //get data from repair request collection
            var query={};
            // if(request_detail.assets_id){
            //     query={"employee_id": employee_id,"assets_id":assets_id} 
            // }else{
            //     query={"employee_id": employee_id} 
            // }
            // repair_request_model.paginate({"employee_id": employee_id} , { page : request_detail.page, limit: request_detail.limit }, function(err, repair_history_list){
             repair_request_model.find({ "employee_id": employee_id }, function (err, repair_history_list) {
                if(repair_history_list.length!=0){
                    // let count=0;
                    // let length=repair_history_list.docs.length;
                    // async.forEach(repair_history_list.docs, function(repair_list, callback) {
                    //     var assets_id = mongoose.Types.ObjectId(repair_list._doc.assets_id);        
                    //     var employee_id = mongoose.Types.ObjectId(repair_list._doc.employee_id);
                    //     assets_model.find({ "_id":assets_id}, function (err, asset_data) {
                    //         employees_model.find({ "_id":employee_id}, function (err, emp_data) {
                    //             if(asset_data.length>0 && emp_data.length>0){
                    //                 repair_list._doc.assets_id=asset_data[0]._doc;
                    //                 repair_list._doc.employee_id=emp_data[0]._doc;
                    //                 resData.repairRequestList.push(repair_list._doc);
                    //                 count=count+1;
                    //                 callback();
                    //             }
                    //         });
                    //     });
                    // }, function(err) {
                    //     res['success']='true';
                    //     if(count >= length){
                    //         // resData.repairRequestList.sort(function(a,b){
                    //         // var c:any = new Date(a.created_date);
                    //         // var d:any = new Date(b.created_date);
                    //         // return c-d;
                    //         // })
                    //         res.send(resData);
                    //     } 
                    // });
                    resData.repairRequestList=repair_history_list;
                    res['success']='true';
                    res.send(resData);
                }else{
                    res['error']=err;
                    res.send(resData);
                }
            });
        }
    }
}