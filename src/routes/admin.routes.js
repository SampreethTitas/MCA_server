import express from 'express';
import { protect } from '../middleware/auth.js';
import { allowRoles } from '../middleware/role.js';
import {
  createStudent,
  getStudents,
  updateStudent,
  disableStudent
} from '../controllers/admin.student.controller.js';
import {
  createFaculty,
  getFaculty,
  updateFaculty,
  disableFaculty
} from '../controllers/admin.faculty.controller.js';

const router = express.Router();

router.post('/students', protect, allowRoles('ADMIN'), createStudent);
router.get('/students', protect, allowRoles('ADMIN'), getStudents);
router.put('/students/:id', protect, allowRoles('ADMIN'), updateStudent);
router.patch('/students/:id/disable', protect, allowRoles('ADMIN'), disableStudent);



router.post('/faculty', protect, allowRoles('ADMIN'), createFaculty);
router.get('/faculty', protect, allowRoles('ADMIN'), getFaculty);
router.put('/faculty/:id', protect, allowRoles('ADMIN'), updateFaculty);
router.patch('/faculty/:id/disable', protect, allowRoles('ADMIN'), disableFaculty);


import {
  createSubject,
  getSubjects,
  updateSubject,
  disableSubject
} from '../controllers/admin.subject.controller.js';

router.post('/subjects', protect, allowRoles('ADMIN'), createSubject);
router.get('/subjects', protect, allowRoles('ADMIN'), getSubjects);
router.put('/subjects/:id', protect, allowRoles('ADMIN'), updateSubject);
router.patch('/subjects/:id/disable', protect, allowRoles('ADMIN'), disableSubject);

import { createTimetableEntry } from '../controllers/admin.timetable.controller.js';

router.post('/timetable', protect, allowRoles('ADMIN'), createTimetableEntry);
import { getTimetable, updateTimetableEntry, upsertTimetableSlot } from '../controllers/admin.timetable.controller.js';

router.get('/timetable', protect, allowRoles('ADMIN'), getTimetable);
router.put('/timetable/:id', protect, allowRoles('ADMIN'), updateTimetableEntry);
router.post('/timetable/slot', protect, allowRoles('ADMIN'), upsertTimetableSlot);
router.get('/timetable', protect, allowRoles('ADMIN'), getTimetable);


import {
  createResource,
  getResources,
  updateResource,
  disableResource
} from '../controllers/admin.resource.controller.js';

router.post('/resources', protect, allowRoles('ADMIN'), createResource);
router.get('/resources', protect, allowRoles('ADMIN'), getResources);
router.put('/resources/:id', protect, allowRoles('ADMIN'), updateResource);
router.patch('/resources/:id/disable', protect, allowRoles('ADMIN'), disableResource);

import {
  createBatch,
  getBatches,
  updateBatch,
  disableBatch
} from '../controllers/admin.batch.controller.js';

router.post('/batches', protect, allowRoles('ADMIN'), createBatch);
router.get('/batches', protect, allowRoles('ADMIN'), getBatches);
router.put('/batches/:id', protect, allowRoles('ADMIN'), updateBatch);
router.patch('/batches/:id/disable', protect, allowRoles('ADMIN'), disableBatch);


export default router;
