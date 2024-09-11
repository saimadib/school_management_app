
const Student = require('../models/student');
const User = require('../models/user'); // Assuming user model is in models/user.js
const Class=require('../models/class')
// Create a new student
exports.createStudent = async (req, res) => {
  try {
    // Validate required fields
    const { email, password, name, gender, dob, phone, feesPaid } = req.body;
    if (!email || !password || !name || !gender || !dob || !phone ) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const feesPaidBoolean = feesPaid === 'true' || feesPaid === true; 

    // Create new user with role 'student'
    const user = new User({email,password,role: 'student',isApproved: true});

    // Save the user
    await user.save();

    // Create the student record
    const student = new Student({user: user._id,name,gender,dob,contactDetails: { phone, email },feesPaid:feesPaidBoolean});

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
    const students = await Student.find()
    .populate({
      path: 'user',
      select: 'email isApproved'
    })
    .populate({
      path: 'classes',  // Populate the assignedClass field
      select: 'name',         // Select only the 'name' field from the Class model
    })
    .exec();


    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).populate('user', 'email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific student by ID
exports.getStudentByIdParams = async (req, res) => {
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
    let { email, isApproved, ...studentData } = req.body;

    // Convert "Yes" to true and "No" to false for isVerified
    if (isApproved === 'Yes') {
      isApproved = true;
    } else if (isApproved === 'No') {
      isApproved = false;
    }


    // Find the student by ID
    const student = await Student.findById(req.params.id).populate('user');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student fields
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, studentData, { new: true }).populate('user');

    // Update user fields if email or isVerified is provided
    if (email !== undefined || isVerified !== undefined) {
      const userUpdate = {};
      if (email) userUpdate.email = email;
      if (isApproved !== undefined) userUpdate.isApproved = isApproved;

      // Update the user associated with the student
      await User.findByIdAndUpdate(student.user._id, userUpdate, { new: true });
    }

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
    // Find the student by their ID
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find all classes where the student is enrolled and populate teacher and their details
    const classes = await Class.find({ students: student._id })
      .populate({
        path: 'teacher', // Populate the teacher field
        populate: [
          { path: 'user', select: 'email name' }, // Populate user info within the teacher document
          { path: 'assignedClass', select: 'name year' }, // Populate the classes the teacher is assigned to
        ]
      });

    if (!classes || classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for this student' });
    }

    // Extract the list of teachers
    const teachers = classes.map(cls => cls.teacher);

    // Remove duplicate teachers (if the same teacher teaches multiple classes)
    const uniqueTeachers = [...new Set(teachers.map(teacher => teacher._id.toString()))]
      .map(id => teachers.find(teacher => teacher._id.toString() === id));

    // Return the list of teachers with populated fields
    res.status(200).json(uniqueTeachers);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the classes the student is enrolled in
exports.getStudentClasses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the student by their user ID
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find all classes where the student is enrolled
    const classes = await Class.find({ students: student._id })
                               .populate('teacher', 'email contactDetails.email')  
                               .populate('students', 'email contactDetails.email');   

    if (!classes.length) {
      return res.status(404).json({ message: 'No classes found for this student' });
    }

    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific student by ID and exclude the 'classes' field
exports.getMe = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the student and exclude the 'classes' field using select('-classes')
    const student = await Student.findOne({ user: userId })
      .populate('user', 'email')  // Populate 'user' field with email
      .select('-classes');  // Exclude the 'classes' field

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

