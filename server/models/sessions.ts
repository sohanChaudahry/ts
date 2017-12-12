import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: String,
  expiry: Date,
  ctime: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
// Before saving the user, hash the password
tokenSchema.pre('save', function(next) {
  if(this.isNew){
    this.ctime=new Date();
  }
  next();
});
tokenSchema.post('save', function(next) {
  const session = this;
  this.collection.update(
    {token: {$ne: session.token},expiry:{$gte:new Date()},user: session.user},
    {$set: {expiry: new Date()}},
    {multi: true}, next);
});
tokenSchema.methods.isValidToken = function() {
 return this.expiry > new Date();
};
const Session = mongoose.model('Session', tokenSchema);

export default Session;
