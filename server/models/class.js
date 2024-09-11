const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    validate: [arrayLimit, 'Exceeds the limit of 30 students'] 
  }],
  fees: { type: Number, required: true }
});

// Custom validation function to limit students to 30
function arrayLimit(val) {
  return val.length <= 30;
}

module.exports = mongoose.model('Class', classSchema);
