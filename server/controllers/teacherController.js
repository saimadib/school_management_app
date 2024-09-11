const Teacher = require('../models/teacher');
const User = require('../models/user');
const Class = require('../models/class'); // Ensure you have the correct path to your Class model
const Student=require('../models/student')

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { email, password, name, gender, dob, phone, salary } = req.body;

    // Ensure required fields are present
    if (!email || !password || !name || !gender || !dob || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create and save the user first
    const user = new User({ email, password, role: 'teacher', isApproved: true }); // Role set as 'teacher' and verified as true as it is performed by admin
    await user.save();

    // Create and save the teacher
    const teacher = new Teacher({
      user: user._id,
      name,
      gender,
      dob,
      contactDetails: { phone, email },
      salary
    });
    const savedTeacher = await teacher.save();

    res.status(201).json(savedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.getAllTeachers = async (req, res) => {
  try {
    // Find all teachers
    const teachers = await Teacher.find()
      .populate({
        path: 'user',
        select: 'email isApproved'
      })
      .populate({
        path: 'assignedClass',  // Populate the assignedClass field
        select: 'name',         // Select only the 'name' field from the Class model
      })
      .exec();

    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('user', 'email');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a teacher by ID
exports.updateTeacher = async (req, res) => {
  try {
    let { email, isApproved, ...teacherData } = req.body;

    // Convert "Yes" to true and "No" to false for isApproved
    if (isApproved === 'Yes') {
      isApproved = true;
    } else if (isApproved === 'No') {
      isApproved = false;
    }

    // Find the teacher by ID
    const teacher = await Teacher.findById(req.params.id).populate('user');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update teacher fields
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, teacherData, { new: true }).populate('user');

    // Update user fields if email or isApproved is provided
    if (email !== undefined || isApproved !== undefined) {
      const userUpdate = {};
      if (email) userUpdate.email = email;
      if (isApproved !== undefined) userUpdate.isApproved = isApproved;

      // Update the user associated with the teacher
      await User.findByIdAndUpdate(teacher.user._id, userUpdate, { new: true });
    }

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a teacher by ID
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete the user associated with the teacher
    await User.findByIdAndDelete(teacher.user);
    
    // Delete the teacher
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get list of students teacher is teaching to
exports.getStudentsByTeacher = async (req, res) => {
  try {

    const userId = req.user._id;

    //Find the teacher by ID and populate the assignedClass field
    const teacher = await Teacher.findOne({ user: userId }).populate({
      path: 'assignedClass', 
      populate: { path: 'students' }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    //Gather all students from the classes the teacher is teaching
    const students = [];
    for (const singleClass of teacher.assignedClass) {
      if (singleClass.students && singleClass.students.length > 0) {
        // Fetch students and populate the user and classes fields
        const populatedStudents = await Student.find({ _id: { $in: singleClass.students } })
          .populate('user')
          .populate('classes')
          .exec();
        
        students.push(...populatedStudents);
      }
    }

    res.status(200).json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get list of students teacher is teaching to
exports.getClassesByTeacher = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the teacher by ID and populate both assignedClass, students, and teacher
    const teacher = await Teacher.findOne({ user: userId }).populate({
      path: 'assignedClass',
      populate: [
        { path: 'students' },        // Populating students in the class
        { path: 'teacher', select: 'email contactDetails.email' },  // Populating the teacher details
      ],
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher.assignedClass);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a specific teacher by ID
exports.getMe = async (req, res) => {
  try {
    const userId=req.user._id;
    const teacher = await Teacher.findOne({ user: userId }).populate('user', 'email');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
