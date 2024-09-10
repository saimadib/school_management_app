const express = require('express');
const router = express.Router();
const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getTeachers,
  getStudentClasses 
} = require('../controllers/studentController');

const {protect,authorizeRoles} =require('../middlewares/authMiddleware')

// Routes for CRUD operations

// Only admin can manage students
router.use(protect); // Protect all routes below

// Admin only for adding, updating, and deleting students
router.post('/', authorizeRoles('admin'), createStudent);
router.put('/:id', authorizeRoles('admin'), updateStudent);
router.delete('/:id', authorizeRoles('admin'), deleteStudent);
router.get('/', authorizeRoles('admin'), getAllStudents);

// Both teachers and admin can view students;
router.get('/:id', authorizeRoles('admin', 'student'), getStudentById);
router.get('/teachers/:id',authorizeRoles('admin','student'),getTeachers);
router.get('/classes/:id',authorizeRoles('admin','student'),getStudentClasses);

module.exports = router;
