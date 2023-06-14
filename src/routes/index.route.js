import express from 'express';
import test from '../controllers/test.controller';
import page from '../controllers/page.controller';
import stylesheet from '../controllers/styles.controller';
import addSuperAdmin from "../controllers/add.super.admin.controller";
import login from "../controllers/login.controller";
import verification from '../controllers/2FA.verification.controller';
import homeController from '../controllers/home.controller';
import signup from '../controllers/signup.controller';
import { authorizeRole } from '../middlewares/roles.authorizer.middleware';
import addhospital from '../controllers/add.hospital.controller';
import { authorizeAdmin, authorizeHc_provider, authorizeHcp_ptnt, authorizePatient, authorizePatientToken, authorizePharmacist } from '../middlewares/users.authoriser.middleware';
import addemployee from '../controllers/add.employee.controller';
import { getHP, getHPs, searchHP } from '../controllers/hospital.profile.controller';
import {addSession, getUsessions, session } from '../controllers/patient.session.controller';
import addmedicine from '../controllers/add.medicine.controller';
import addDepartment from '../controllers/add.department.controller';
import addtest from '../controllers/add.tests.controller';
import {addAppointment, appointment, hcpAppointments, myAppointments} from '../controllers/appointment.controller';
import { CheckAppointmentTimer } from '../middlewares/time.authorizer.middleware';
import { addCell, addDistrict, addProvince, addSector } from '../controllers/add.location.controller';
import getMap from '../controllers/get.locations.controller';
import addInventory from '../controllers/add.inventory.controller';
import { authorizeHospital } from '../middlewares/hospital.authorizer.middleware';
import getInventory from '../controllers/get.inventory.controller';
import sendMessage from '../controllers/message.sender.controller';
import { getMed, getMeds, searchMed } from '../controllers/get.medicines.controller';
import { authorizeAppointmentAccess } from '../middlewares/appointment.authorizer.middleware';
const router = express.Router({ strict: true });

router.post('/verify',verification)
router.post('/get-user-medical-history/:userid',authorizeRole,authorizeHcp_ptnt,getUsessions)
router.post('/session/:session',authorizeRole,authorizeHcp_ptnt,session)
router.post('/addhealthpost',authorizeRole,authorizeAdmin,addhospital)
router.post('/add-appointment',authorizeRole,authorizePatientToken,CheckAppointmentTimer,addAppointment)
router.post("/addmedicine",authorizeRole,authorizeAdmin,addmedicine)
router.post("/addtest",authorizeRole,authorizeAdmin,addtest)
router.post("/add-province",authorizeRole,authorizeAdmin,addProvince)
router.post("/add-district",authorizeRole,authorizeAdmin,addDistrict)
router.post("/add-sector",authorizeRole,authorizeAdmin,addSector)
router.post("/add-cell",authorizeRole,authorizeAdmin,addCell)
router.post('/addemployee',authorizeRole,authorizeAdmin,authorizeHospital,addemployee)
router.post('/addsession',authorizeRole,authorizeHc_provider,authorizePatient,addSession)
router.get('/api/test',test);
router.get('/get-map',getMap);
router.post('/appointment/:id',authorizeRole,authorizeAppointmentAccess,appointment)
router.post('/my-appointments',authorizeRole,authorizePatientToken,myAppointments)
router.post('/hcp-appointments',authorizeRole,authorizeHc_provider,hcpAppointments)
router.post('/appointment/:id',authorizeRole,authorizeHc_provider,appointment)
router.get('/medicine/:medicine',getMed);
router.post('/search-medicine/:medicine',authorizeRole,searchMed);
router.post('/add-inventory',authorizeRole,authorizePharmacist,addInventory);
router.post('/getmeds',authorizeRole,authorizeAdmin,getMeds);
router.post('/send-message',authorizeRole,sendMessage);
router.post('/get-inventory',authorizeRole,authorizePharmacist,getInventory);
router.post('/gethospitals',authorizeRole,getHPs)
router.post('/hospital/:hospital',authorizeRole,getHP)
router.post('/search-hospital/:hospital',authorizeRole,searchHP)
router.post('/add-department',authorizeRole,authorizeAdmin,addDepartment)
router.get('/styles/:filename',stylesheet);
router.get('/addadmin',addSuperAdmin);
router.get('/',homeController);
router.post('/login',login);
router.get('/:filename([\\w/]+)',page);
router.post('/signup', signup)
export default router