import * as mongoose from 'mongoose';

var employeeSchema = new mongoose.Schema({
    name: { type: String, uppercase: true, trim: true },
    act_status: { type: Number, default: 0 },
    email: { type: String, trim: true },
    address : String,
    type : String,
    user_id: { type: String, trim: true },
    create_date : Date,
    modify_date: Date
});
var employees = mongoose.model('employees', employeeSchema);
export default employees;