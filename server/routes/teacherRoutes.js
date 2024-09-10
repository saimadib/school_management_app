const express = require('express');
const router = express.Router();
const { 
  createTeacher, 
  getAllTeachers, 
  getTeacherById, 
  updateTeacher, 
  deleteTeacher 
} = require('../controllers/teacherController');

const {protect,authorizeRoles} =require('../middlewares/authMiddleware')

// Routes for CRUD operations

// Only admin and teacher can access these routes
router.use(protect);

// Only admin can manage teachers
router.post('/', authorizeRoles('admin'), createTeacher);//Create teacher
router.put('/:id', authorizeRoles('admin'), updateTeacher);//Update teacher
router.delete('/:id', authorizeRoles('admin'), deleteTeacher);//Delete teacher
router.get('/', authorizeRoles('admin'), getAllTeachers);//get the list of all the teachers

// Both teachers and admin can view teachers
router.get('/:id', authorizeRoles('admin', 'teacher'), getTeacherById);//get specific teacher details

module.exports = router;
