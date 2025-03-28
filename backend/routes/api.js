const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Session = require('../models/Session');
require('dotenv').config();

// Login endpoint (for all roles)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
});

// Admin creates user (only admin can call this)
router.post('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ msg: 'Admins only' });
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role, createdBy: req.user.id });
  await user.save();
  res.status(201).json(user);
});

// Lecturer creates course
router.post('/courses', auth, async (req, res) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ msg: 'Lecturers only' });
  const { title } = req.body;
  const enrollmentKey = Math.random().toString(36).substring(2, 10);
  const course = new Course({ title, lecturer: req.user.id, enrollmentKey });
  await course.save();
  res.status(201).json(course);
});

// Lecturer updates course details (including editing enrollment key)
router.put('/courses/:id', auth, async (req, res) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ msg: 'Lecturers only' });
  const course = await Course.findById(req.params.id);
  if (!course || course.lecturer.toString() !== req.user.id)
    return res.status(404).json({ msg: 'Course not found or unauthorized' });
  // Allow updates to title and enrollmentKey
  const { title, enrollmentKey } = req.body;
  if (title) course.title = title;
  if (enrollmentKey) course.enrollmentKey = enrollmentKey;
  await course.save();
  res.json(course);
});

// Student enrolls in course
router.post('/courses/enroll', auth, async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Students only' });
  const { enrollmentKey } = req.body;
  const course = await Course.findOne({ enrollmentKey });
  if (!course) return res.status(404).json({ msg: 'Invalid enrollment key' });
  course.students.push(req.user.id);
  await course.save();
  res.json(course);
});

// Lecturer creates session
router.post('/sessions', auth, async (req, res) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ msg: 'Lecturers only' });
  const { courseId, startTime, endTime } = req.body;
  const session = new Session({ course: courseId, startTime, endTime });
  await session.save();
  res.status(201).json(session);
});

// Lecturer updates session details
router.put('/sessions/:id', auth, async (req, res) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ msg: 'Lecturers only' });
  const session = await Session.findById(req.params.id).populate('course');
  if (!session || session.course.lecturer.toString() !== req.user.id)
    return res.status(404).json({ msg: 'Session not found or unauthorized' });
  // Allow updates: startTime, endTime, proximityRange
  const { startTime, endTime, proximityRange } = req.body;
  if (startTime) session.startTime = startTime;
  if (endTime) session.endTime = endTime;
  if (proximityRange) session.proximityRange = proximityRange;
  await session.save();
  res.json(session);
});

// Lecturer broadcasts location (for an active session)
router.post('/sessions/:id/broadcast', auth, async (req, res) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ msg: 'Lecturers only' });
  const { lat, lng, proximityRange } = req.body;
  const session = await Session.findById(req.params.id).populate('course');
  if (!session || session.course.lecturer.toString() !== req.user.id)
    return res.status(404).json({ msg: 'Session not found or unauthorized' });
  session.location = { lat, lng };
  if (proximityRange) session.proximityRange = proximityRange;
  await session.save();
  res.json(session);
});

// Student marks attendance
router.post('/sessions/:id/attendance', auth, async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Students only' });
  const { lat, lng } = req.body;
  const session = await Session.findById(req.params.id).populate('course');
  if (!session || !session.isActive)
    return res.status(400).json({ msg: 'Session not active' });

  // Calculate distance (Haversine formula)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  const distance = getDistance(session.location.lat, session.location.lng, lat, lng);
  if (distance > session.proximityRange)
    return res.status(400).json({ msg: 'Outside allowed proximity' });

  session.attendance.push({ student: req.user.id });
  await session.save();
  res.json({ msg: 'Attendance marked' });
});

module.exports = router;
