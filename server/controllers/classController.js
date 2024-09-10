const Class = require('../models/class');
const Teacher = require('../models/teacher'); // Assuming Teacher model exists
const Student = require('../models/student'); // Assuming Student model exists

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { name, year, teacher, students, fees } = req.body;

    // Validate required fields
    if (!name || !year || !fees) {
      return res.status(400).json({ error: 'Name, year, and fees are required fields' });
    }

    // Validate if teacher exists
    if (teacher) {
      const teacherExists = await Teacher.findById(teacher);
      if (!teacherExists) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
    }

    // Validate if students exist
    if (students && students.length > 0) {
      const validStudents = await Student.find({ _id: { $in: students } });
      if (validStudents.length !== students.length) {
        return res.status(404).json({ error: 'Some students were not found' });
      }
    }

    // Create new class
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher students');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific class by ID
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('teacher students');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check the user's role
    const userRole = req.user.role; 
    const userId = req.user._id;    

    // Admin can access any class
    if (userRole === 'admin') {
      return res.status(200).json(classData);
    }

    // Teacher can only access classes they are assigned to
    if (userRole === 'teacher') {
      if (classData.teacher.equals(userId)) {
        return res.status(200).json(classData);
      } else {
        return res.status(403).json({ message: 'Access denied: You do not teach this class' });
      }
    }

    // Student can only access classes they are enrolled in
    if (userRole === 'student') {
      const isEnrolled = classData.students.some(studentId => studentId.equals(userId));
      if (isEnrolled) {
        return res.status(200).json(classData);
      } else {
        return res.status(403).json({ message: 'Access denied: You are not enrolled in this class' });
      }
    }

    // If none of the roles match, return forbidden
    return res.status(403).json({ message: 'Access denied' });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update a class by ID
exports.updateClass = async (req, res) => {
  try {
    const { teacher, students } = req.body;

    // Validate if teacher exists
    if (teacher) {
      const teacherExists = await Teacher.findById(teacher);
      if (!teacherExists) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
    }

    // Validate if students exist
    if (students && students.length > 0) {
      const validStudents = await Student.find({ _id: { $in: students } });
      if (validStudents.length !== students.length) {
        return res.status(404).json({ error: 'Some students were not found' });
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('teacher students');
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
