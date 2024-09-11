const express = require('express');
const router = express.Router();
const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getTeachers,
  getStudentClasses,
  getStudentByIdParams,
  getMe 
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
router.get('/det/:id', authorizeRoles('admin','teacher'), getStudentByIdParams);

router.get('/detail', authorizeRoles('student'), getStudentById);
router.get('/teachers',authorizeRoles('student'),getTeachers);
router.get('/classes',authorizeRoles('student'),getStudentClasses);
router.get('/detail/me',authorizeRoles('student'),getMe);

module.exports = router;
