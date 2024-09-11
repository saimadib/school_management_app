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
    let teacherId;
    if (teacher) {
      const teacherFind = await Teacher.findOne({ 'contactDetails.email': teacher });
      if (!teacherFind) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      teacherId = teacherFind._id;
    }

    // Validate if students exist
    let studentIds = [];
    if (students && students.length > 0) {
      const studentsFind = await Student.find({ 'contactDetails.email': { $in: students } });
      // if (students.length !== studentsFind.length) {
      //   return res.status(404).json({ error: 'Some students were not found' });
      // }
      studentIds = studentsFind.map(s => s._id);
    }

    // Create new class
    const newClass = new Class({
      name,
      year,
      teacher: teacherId,
      students: studentIds,
      fees
    });
    const savedClass = await newClass.save();

    // Update teacher's assignedClass if a teacher was provided
    if (teacherId) {
      await Teacher.findByIdAndUpdate(
        teacherId,
        { $push: { assignedClass: savedClass._id } },
        { new: true }
      );
    }

    // Update students' assignedClasses if students are provided
    if (studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $push: { assignedClasses: updatedClass._id } } // Add class ID to students’ assignedClasses list
      );
    }

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

    // // Teacher can only access classes they are assigned to
    // if (userRole === 'teacher') {
    //   if (classData.teacher.equals(userId)) {
    //     return res.status(200).json(classData);
    //   } else {
    //     return res.status(403).json({ message: 'Access denied: You do not teach this class' });
    //   }
    // }

    // // Student can only access classes they are enrolled in
    // if (userRole === 'student') {
    //   const isEnrolled = classData.students.some(studentId => studentId.equals(userId));
    //   if (isEnrolled) {
    //     return res.status(200).json(classData);
    //   } else {
    //     return res.status(403).json({ message: 'Access denied: You are not enrolled in this class' });
    //   }
    // }

    // If none of the roles match, return forbidden
    return res.status(200).json(classData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update a class by ID
exports.updateClass = async (req, res) => {
  try {
    const { teacher, students, ...updateFields } = req.body; // Extract teacher and students from body

    // Validate if teacher exists if provided
    let teacherId;
    if (teacher) {
      const teacherFind = await Teacher.findOne({ 'contactDetails.email': teacher });
      if (!teacherFind) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      teacherId = teacherFind._id;
    }

    // Convert students from a comma-separated string array to an array of emails
    let studentIds = [];
    if (students && students.length > 0) {
      // Join all strings into one string, split by comma, trim whitespace, and filter out empty strings
      const emailArray = students.join(',').split(',').map(email => email.trim()).filter(email => email);

      // Find students based on the array of email addresses
      const studentsFind = await Student.find({ 'contactDetails.email': { $in: emailArray } });
      studentIds = studentsFind.map(s => s._id);

      // Check if all provided emails matched students
      if (emailArray.length !== studentsFind.length) {
        return res.status(404).json({ error: 'Some students were not found' });
      }
    }



    // Update class details
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { ...updateFields, teacher: teacherId, students: studentIds }, // Merge update fields and references
      { new: true }
    ).populate('teacher students');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update teacher’s assignedClass if a teacher was provided
    if (teacherId) {
      // Add class to the new teacher's assignedClass list
      await Teacher.findByIdAndUpdate(
        teacherId,
        { $addToSet: { assignedClass: updatedClass._id } }, // Use $addToSet to avoid duplicates
        { new: true }
      );
    }

    // // If teacher was previously assigned and is now removed or changed, remove class ID from previous teacher’s assignedClass list
    // if (existingClass.teacher && existingClass.teacher.toString() !== teacherId.toString()) {
    //   await Teacher.findByIdAndUpdate(
    //     existingClass.teacher,
    //     { $pull: { assignedClass: existingClass._id } }, // Remove class ID from previous teacher’s assignedClass list
    //     { new: true }
    //   );
    // }

    // Update students' assignedClasses if students are provided
    if (studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $addToSet: { classes: updatedClass._id } } // Use $addToSet to avoid duplicates
      );
    }

    // // If students were previously assigned and are now removed, remove class ID from those students' assignedClasses list
    // if (existingClass.students.length > 0) {
    //   await Student.updateMany(
    //     { _id: { $in: existingClass.students } },
    //     { $pull: { assignedClasses: existingClass._id } } // Remove class ID from previously assigned students' assignedClasses list
    //   );
    // }


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
