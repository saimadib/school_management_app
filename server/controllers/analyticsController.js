const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Class = require('../models/class'); // Assuming you have a Class model

exports.schoolDetails = async (req, res) => {
  try {
    // Fetch the total number of teachers
    const totalTeachers = await Teacher.countDocuments();

    // Fetch the total number of students
    const totalStudents = await Student.countDocuments();

    // Fetch the total number of classes
    const totalClasses = await Class.countDocuments();

    // Send the response with the counts
    res.status(200).json({
      totalTeachers,
      totalStudents,
      totalClasses
    });
  } catch (error) {
    // Handle errors and send a response with an error message
    res.status(500).json({ message: error.message });
  }
};

// GET - Fetch financial data by viewType (monthly/yearly), month, and year
const dummyData = {
  2024: [
    { month: 'January', income: 10000, expense: 5000 },
    { month: 'February', income: 12000, expense: 6000 },
    { month: 'March', income: 11000, expense: 5500 },
    { month: 'April', income: 11500, expense: 5700 },
    { month: 'May', income: 12500, expense: 6200 },
    { month: 'June', income: 13000, expense: 6300 },
    { month: 'July', income: 14000, expense: 6500 },
    { month: 'August', income: 14500, expense: 6800 },
    { month: 'September', income: 15000, expense: 7000 },
    { month: 'October', income: 15500, expense: 7200 },
    { month: 'November', income: 16000, expense: 7400 },
    { month: 'December', income: 16500, expense: 7600 },
  ],
  2023: [
    { month: 'January', income: 9500, expense: 4000 },
    { month: 'February', income: 10500, expense: 4500 },
    { month: 'March', income: 10000, expense: 4300 },
    { month: 'April', income: 10800, expense: 4600 },
    { month: 'May', income: 11200, expense: 4800 },
    { month: 'June', income: 11500, expense: 4900 },
    { month: 'July', income: 12000, expense: 5000 },
    { month: 'August', income: 12500, expense: 5200 },
    { month: 'September', income: 13000, expense: 5400 },
    { month: 'October', income: 13500, expense: 5500 },
    { month: 'November', income: 14000, expense: 5600 },
    { month: 'December', income: 14500, expense: 5800 },
  ],
  2022: [
    { month: 'January', income: 9000, expense: 4200 },
    { month: 'February', income: 9800, expense: 4300 },
    { month: 'March', income: 9400, expense: 4400 },
    { month: 'April', income: 10000, expense: 4500 },
    { month: 'May', income: 10500, expense: 4700 },
    { month: 'June', income: 11000, expense: 4800 },
    { month: 'July', income: 11500, expense: 4900 },
    { month: 'August', income: 12000, expense: 5000 },
    { month: 'September', income: 12500, expense: 5200 },
    { month: 'October', income: 13000, expense: 5300 },
    { month: 'November', income: 13500, expense: 5500 },
    { month: 'December', income: 14000, expense: 5700 },
  ],
  2021: [
    { month: 'January', income: 8500, expense: 4000 },
    { month: 'February', income: 9200, expense: 4100 },
    { month: 'March', income: 8900, expense: 4200 },
    { month: 'April', income: 9300, expense: 4300 },
    { month: 'May', income: 9500, expense: 4400 },
    { month: 'June', income: 9800, expense: 4500 },
    { month: 'July', income: 10000, expense: 4600 },
    { month: 'August', income: 10200, expense: 4700 },
    { month: 'September', income: 10500, expense: 4800 },
    { month: 'October', income: 11000, expense: 4900 },
    { month: 'November', income: 11200, expense: 5000 },
    { month: 'December', income: 11500, expense: 5200 },
  ],
  2020: [
    { month: 'January', income: 8000, expense: 3900 },
    { month: 'February', income: 8700, expense: 4000 },
    { month: 'March', income: 8500, expense: 4100 },
    { month: 'April', income: 8800, expense: 4200 },
    { month: 'May', income: 9000, expense: 4300 },
    { month: 'June', income: 9200, expense: 4400 },
    { month: 'July', income: 9500, expense: 4500 },
    { month: 'August', income: 9700, expense: 4600 },
    { month: 'September', income: 10000, expense: 4700 },
    { month: 'October', income: 10200, expense: 4800 },
    { month: 'November', income: 10500, expense: 4900 },
    { month: 'December', income: 10800, expense: 5000 },
  ],
};

exports.expense = async (req, res) => {
  const { viewType, month, year } = req.body;

  if (!year || !viewType) {
    return res.status(400).json({ message: 'Year and viewType are required' });
  }

  if (!dummyData[year]) {
    return res.status(404).json({ message: 'Year not found' });
  }

  if (viewType === 'monthly') {
    if (!month) {
      return res.status(400).json({ message: 'Month is required for monthly view type' });
    }

    const monthData = dummyData[year].find(data => data.month === month);

    if (!monthData) {
      return res.status(404).json({ message: 'Month data not found' });
    }

    const { income, expense } = monthData;
    const profit = income - expense;

    return res.status(200).json({ income, expense, profit, month, year });
  }

  if (viewType === 'yearly') {
    const yearlyData = dummyData[year];

    if (!yearlyData) {
      return res.status(404).json({ message: 'Yearly data not found' });
    }

    const income = yearlyData.reduce((sum, data) => sum + data.income, 0);
    const expense = yearlyData.reduce((sum, data) => sum + data.expense, 0);
    const profit = income - expense;

    return res.status(200).json({ income, expense, profit, year });
  }

  return res.status(400).json({ message: 'Invalid viewType. Must be "monthly" or "yearly".' });
}

exports.TeacherDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the teacher details
    const teacher = await Teacher.findOne({ user: userId }).populate('assignedClass').exec();
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Fetch the total number of students for this teacher
    const totalStudents = await Student.countDocuments({ classes: { $in: teacher.assignedClass } });

    // Fetch the total number of classes assigned to this teacher
    const totalClasses = teacher.assignedClass.length;

    // Send the response with the counts
    res.status(200).json({
      totalStudents,
      totalClasses
    });
  } catch (error) {
    // Handle errors and send a response with an error message
    res.status(500).json({ message: error.message });
  }
};


exports.studentDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the student details
    const student = await Student.findOne({ user: userId }).populate('classes').exec();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch the total number of classes the student is enrolled in
    const totalClasses = student.classes.length;

    // Fetch the total number of teachers for these classes
    const classIds = student.classes.map(c => c._id);
    const teachers = await Teacher.find({ assignedClass: { $in: classIds } }).distinct('_id');
    const totalTeachers = teachers.length;

    // Send the response with the counts
    res.status(200).json({
      totalTeachers,
      totalClasses
    });
  } catch (error) {
    // Handle errors and send a response with an error message
    res.status(500).json({ message: error.message });
  }
};
