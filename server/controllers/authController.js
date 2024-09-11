const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

// Register new user (students/teachers provide only basic details)
exports.register = async (req, res) => {
  const { email, password, role, name, gender, dob, phone } = req.body;

  if(role==='admin')
  {
    return res.status(403).json({message:"Can't register as admin"});
  }

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(200).json({ message: 'User already exists' });
    }

    // Create and save the new user
    const newUser = await new User({ email, password, role }).save();

    // Shared fields for both Teacher and Student
    const commonFields = { user: newUser._id, name, gender, dob, contactDetails: { phone, email } };

    // Save basic details for teacher or student without admin-controlled fields
    if (role === 'teacher') {
      await new Teacher({ ...commonFields }).save(); 
    } else if (role === 'student') {
      await new Student({ ...commonFields }).save(); 
    }

    res.status(201).json({ message: 'User registered successfully, waiting for admin approval' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account not approved yet' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ message: `Welcome ${user.role}`, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves user
exports.approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot approve admin account' });
    }

    user.isApproved = true;
    await user.save();
    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
