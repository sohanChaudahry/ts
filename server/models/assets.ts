import * as mongoose from 'mongoose';

var assetsSchema = new mongoose.Schema({
    assets_id : { type: String , default : ""},
    assets_name: { type: String , trim: true ,default : ""},
    description: { type: String , trim: true , default : "" },
    employee_id: { type: mongoose.Schema.Types.ObjectId , ref: 'employees' },
    manufacturer : { type: String , trim: true , default : "" },
    rented : { type: Number, default: 1 },
    serical_no : { type: String , trim: true ,default : ""}
});

var mongoosePaginate = require('mongoose-paginate');
assetsSchema.plugin(mongoosePaginate);
const assets = mongoose.model('assets', assetsSchema);
export default assets;

