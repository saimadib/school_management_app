const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  salary: { type: Number},
  assignedClass:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }] 
});

module.exports = mongoose.model('Teacher', teacherSchema);

