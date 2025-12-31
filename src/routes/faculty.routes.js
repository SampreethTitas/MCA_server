import express from 'express';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/role.js';

import { getFacultyTimetable } from '../controllers/faculty.timetable.controller.js';
import {
  getAttendanceSheet,
  submitAttendance
} from '../controllers/faculty.attendance.controller.js';

const router = express.Router();

/* =======================
   FACULTY TIMETABLE
======================= */
router.get(
  '/timetable',
  protect,
  allowRoles('FACULTY', 'ADMIN'),
  getFacultyTimetable
);

/* =======================
   ATTENDANCE
======================= */
router.get(
  '/attendance',
  protect,
  allowRoles('FACULTY', 'ADMIN'),
  getAttendanceSheet
);

router.post(
  '/attendance',
  protect,
  allowRoles('FACULTY', 'ADMIN'),
  submitAttendance
);

export default router;
