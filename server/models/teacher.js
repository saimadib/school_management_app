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

// Pre-save middleware to sync the Teacher's email with the User's email
teacherSchema.pre('save', async function (next) {
  const teacher = this;

  // Find the associated User document
  const user = await mongoose.model('User').findById(teacher.user);

  if (!user) {
    return next(new Error('Associated user not found'));
  }

  // Sync the email in Teacher's contactDetails with User's email
  teacher.contactDetails.email = user.email;

  next();
});


module.exports = mongoose.model('Teacher', teacherSchema);

