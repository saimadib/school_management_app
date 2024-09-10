const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  feesPaid: { type: Boolean },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }] 
});

module.exports = mongoose.model('Student', studentSchema);
