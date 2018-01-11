import * as mongoose from 'mongoose';

var repaiRequestSchema = new mongoose.Schema({

    title : { type: String, trim: true,default: "" },
    description: { type: String, trim: true,default: "" },    
    picture : {type : String, dataType : 'String'},
    status : { type: Number, default: 0 },
    employee_id: { type: mongoose.Schema.Types.ObjectId , ref: 'employees' },
    assets_id : { type: mongoose.Schema.Types.ObjectId , ref: 'assets' },
    created_date : Date,
    modify_date : Date,
   
});
var mongoosePaginate = require('mongoose-paginate');
repaiRequestSchema.plugin(mongoosePaginate);
var repair_request = mongoose.model('repair_request', repaiRequestSchema);
export default repair_request;