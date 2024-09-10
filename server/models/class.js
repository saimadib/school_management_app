const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  fees: { type: Number, required: true }
});

module.exports = mongoose.model('Class', classSchema);
