const student = require('../models/student');
const Student = require('../models/student');
const User = require('../models/user'); // Assuming user model is in models/user.js

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    // Validate required fields
    const { email, password, name, gender, dob, contactDetails, feesPaid, classes } = req.body;
    if (!email || !password || !name || !gender || !dob || !contactDetails || !contactDetails.phone || !contactDetails.email) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Create new user with role 'student'
    const user = new User({email,password,role: 'student',verified: true});

    // Save the user
    await user.save();

    // Create the student record
    const student = new Student({user: user._id,name,gender,dob,contactDetails,feesPaid,classes});

    // Save the student
    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    // Find all students and populate the user field
    const students = await Student.find().populate({path: 'user',select: 'email isApproved', }).exec();

    // Filter students whose users are verified
    const verifiedStudents = students.filter(student => student.user.isApproved);

    res.status(200).json(verifiedStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a student by ID
exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'email');
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the user associated with the student
    await User.findByIdAndDelete(student.user);
    
    // Delete the student
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {

    //Find the student by their ID
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    //Find all classes where the student is enrolled
    const classes = await Class.find({ students: student._id }).populate('teacher');

    if (!classes || classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for this student' });
    }

    //Extract the list of teachers
    const teachers = classes.map(cls => cls.teacher);  

    //Remove duplicate teachers (if the same teacher teaches multiple classes)
    const uniqueTeachers = [...new Set(teachers.map(teacher => teacher._id.toString()))]
                           .map(id => teachers.find(teacher => teacher._id.toString() === id));

    //Return the list of teachers
    res.status(200).json(uniqueTeachers);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentClasses = async (req, res) => {
  try {
    //Find the student by their ID and populate the 'classes' field
    const student = await Student.findById(req.params.id).populate({
      path: 'classes', 
      populate: { path: 'teacher' }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    //If the student is found, return the list of classes they are enrolled in
    res.status(200).json(student.classes);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
