const express = require('express');
const router = express.Router();
const { 
    schoolDetails, 
    expense,
    TeacherDetails,
    studentDetails
} = require('../controllers/analyticsController');

const {protect,authorizeRoles} =require('../middlewares/authMiddleware')

// Routes for CRUD operations
router.use(protect);

//get number of teachers,students,classes in a school
router.get('/schoolDetails',authorizeRoles('admin'), schoolDetails);

router.post('/expense',authorizeRoles('admin'), expense);
router.get('/teacherDetails',authorizeRoles('teacher'), TeacherDetails);
router.get('/studentDetails',authorizeRoles('student'), studentDetails);

module.exports = router;
