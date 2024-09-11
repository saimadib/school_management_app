const express = require('express');
const router = express.Router();
const { 
  createClass, 
  getAllClasses, 
  getClassById, 
  updateClass, 
  deleteClass 
} = require('../controllers/classController');

const {protect,authorizeRoles} =require('../middlewares/authMiddleware')

// Routes for CRUD operations
router.use(protect);
// Create a new class
router.post('/',authorizeRoles('admin'), createClass);

// Get all classes
router.get('/',authorizeRoles('admin'), getAllClasses);

// Get a specific class by ID
router.get('/:id', authorizeRoles('admin', 'teacher','student'),getClassById);

// Update a class by ID
router.put('/:id',authorizeRoles('admin'), updateClass);

// Delete a class by ID
router.delete('/:id',authorizeRoles('admin'), deleteClass);

module.exports = router;
