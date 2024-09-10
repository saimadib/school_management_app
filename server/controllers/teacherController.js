const Teacher = require('../models/teacher');
const User = require('../models/user');

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { email, password, name, gender, dob, phone, salary, assignedClass } = req.body;

    // Ensure required fields are present
    if (!email || !password || !name || !gender || !dob || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create and save the user first
    const user = new User({ email, password, role: 'teacher', verified: true }); // Role set as 'teacher' and verified as true as it is performed by admin
    await user.save();

    // Create and save the teacher
    const teacher = new Teacher({user: user._id,name,gender,dob,contactDetails: {phone,email},salary,assignedClass});
    const savedTeacher = await teacher.save();
    
    res.status(201).json(savedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    // Find all teachers and populate the user field
    const teachers = await Teacher.find().populate({path: 'user',select: 'email isApproved', }).exec();

    // Filter teachers whose users are verified
    const verifiedTeachers = teachers.filter(teacher => teacher.user.isApproved);

    res.status(200).json(verifiedTeachers);
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
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'email');
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
    //Find the teacher by ID and populate the assignedClass field
    const teacher = await Teacher.findById(req.params.id).populate({
      path: 'assignedClass', 
      populate: { path: 'students' }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    //Gather all students from the classes the teacher is teaching
    const students = [];
    teacher.assignedClass.forEach(singleClass => {
      if (singleClass.students && singleClass.students.length > 0) {
        students.push(...singleClass.students);
      }
    });

    res.status(200).json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
