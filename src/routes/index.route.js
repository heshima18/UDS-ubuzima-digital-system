import express from 'express';
import test from '../controllers/test.controller';
import {page} from '../controllers/page.controller';
import {assets, getSocketIo, pluginScripts, stylesheet, utilsScripts } from '../controllers/plugins.controller';
import addSuperAdmin from "../controllers/add.super.admin.controller";
import login from "../controllers/login.controller";
import verification from '../controllers/2FA.verification.controller';
import homeController from '../controllers/home.controller';
import signup from '../controllers/signup.controller';
import { authorizeRole } from '../middlewares/roles.authorizer.middleware';
import { authorizeAdmin, authorizeCashier, authorizeHc_provider, authorizeHcp_ptnt, authorizeLaboratory_scientist, authorizePatient, authorizePatientToken, authorizePharmacist } from '../middlewares/users.authoriser.middleware';
import {addEmployeetoHp, addemployee, getHpEmployees} from '../controllers/employee.controller';
import { getHP, getHPs, searchHP,addhospital } from '../controllers/hospital.controller';
import {addSession, addSessionDecision, addSessionMedicine, addSessionTests, approvePayment, closeSession, getHc_pSessions, getHpsessions, getUsessions, session } from '../controllers/patient.session.controller';
import {addmedicine, getMed, getMeds, searchMed} from '../controllers/medicine.controller';
import addDepartment from '../controllers/add.department.controller';
import {addtest,getTests} from '../controllers/tests.controller';
import {addAppointment, appointment, approveAppointment, declineAppointment, hcpAppointments, myAppointments} from '../controllers/appointment.controller';
import { CheckAppointmentTimer } from '../middlewares/time.authorizer.middleware';
import { addCell, addDistrict, addProvince, addSector } from '../controllers/add.location.controller';
import getMap from '../controllers/get.locations.controller';
import { authorizeHospital } from '../middlewares/hospital.authorizer.middleware';
import {getInventory,addInventory} from '../controllers/inventory.controller';
import sendMessage from '../controllers/message.sender.controller';
import { authorizeAppointmentAccess } from '../middlewares/appointment.authorizer.middleware';
import { authorizeSession } from '../middlewares/session.authorizer.middleware';
import { addUserAssurance, getPatient, getPatients, searchPatient } from '../controllers/patients.controller';
import { addAssurance, getAssurances } from '../controllers/assurance.controller';
import { authorizeUserAssurance } from '../middlewares/assurance.authorizer.middleware';
import { at } from '../controllers/token.verifier.controller';
import { io } from '../socket.io/connector.socket.io';
const router = express.Router({ strict: true });
router.post('/verify',verification)
router.post('/get-user-medical-history/:userid',authorizeRole,authorizeHcp_ptnt,getUsessions)
router.post('/get-hospital-medical-history',authorizeRole,getHpsessions)
router.post('/get-hcp-sessions',authorizeRole,authorizeHc_provider,getHc_pSessions)
router.post('/session/:session',authorizeRole,authorizeHcp_ptnt,session)
router.post('/addhealthpost',authorizeRole,authorizeAdmin,addhospital)
router.post('/add-appointment',authorizeRole,authorizePatientToken,CheckAppointmentTimer,addAppointment)
router.post("/addmedicine",authorizeRole,authorizeAdmin,addmedicine)
router.post("/addtest",authorizeRole,authorizeAdmin,addtest)
router.post("/get-tests",authorizeRole,getTests)
router.post("/get-test/:test",authorizeRole,getTests)
router.post("/add-province",authorizeRole,authorizeAdmin,addProvince)
router.post("/add-district",authorizeRole,authorizeAdmin,addDistrict)
router.post("/add-sector",authorizeRole,authorizeAdmin,addSector)
router.post("/add-assurance",authorizeRole,authorizeAdmin,addAssurance)
router.post("/add-assurance-to-user",authorizeRole,authorizePatientToken,addUserAssurance)
router.post("/add-session-test",authorizeRole,authorizeSession,authorizeLaboratory_scientist,addSessionTests)
router.post("/add-session-medicine",authorizeRole,authorizeSession,authorizeHc_provider,addSessionMedicine)
router.post("/add-session-decisions",authorizeRole,authorizeSession,authorizeHc_provider,addSessionDecision)
router.post("/add-cell",authorizeRole,authorizeAdmin,addCell)
router.post('/addemployee',authorizeRole,authorizeAdmin,authorizeHospital,addemployee)
router.post('/add-employee-to-hp',authorizeRole,authorizeAdmin,authorizeHospital,addEmployeetoHp)
router.post('/get-hp-employees',authorizeRole,authorizeHospital,getHpEmployees)
router.post('/addsession',authorizeRole,authorizeHc_provider,authorizePatient,authorizeUserAssurance,addSession)
router.get('/api/test',test);
router.get('/get-map',getMap);
router.get('/get-assurances',getAssurances);
router.post('/appointment/:id',authorizeRole,authorizeAppointmentAccess,appointment)
router.post('/my-appointments',authorizeRole,authorizePatientToken,myAppointments)
router.post('/hcp-appointments',authorizeRole,authorizeHc_provider,hcpAppointments)
router.post('/appointment/:id',authorizeRole,authorizeHc_provider,appointment)
router.get('/medicine/:medicine',getMed);
router.post('/search-medicine/:medicine',authorizeRole,searchMed);
router.post('/add-inventory',authorizeRole,authorizePharmacist,addInventory);
router.post('/getmeds',authorizeRole,authorizeAdmin,getMeds);
router.post('/approve-appointment',authorizeRole,authorizeHc_provider,approveAppointment);
router.post('/decline-appointment',authorizeRole,authorizeHc_provider,declineAppointment);
router.post('/send-message',authorizeRole,sendMessage);
router.post('/get-inventory',authorizeRole,getInventory);
router.post('/gethospitals',authorizeRole,getHPs)
router.post('/hospital/:hospital',authorizeRole,getHP)
router.post('/search-hospital/:hospital',authorizeRole,searchHP)
router.post('/add-department',authorizeRole,authorizeAdmin,addDepartment)
router.get('/styles/:filename',stylesheet);
router.get('/plugins/:filename',pluginScripts);
router.get('/utils/:filename',utilsScripts);
router.get('/authenticateToken/:token',at);
router.get('/getSocketIo/:filename',getSocketIo);
router.get('/addadmin',addSuperAdmin);
router.post('/approve-payment',authorizeRole,authorizeCashier,approvePayment);
router.post('/get-patients',authorizeRole,authorizeAdmin,getPatients);
router.post('/patient/:patient',authorizeRole,getPatient);
router.post('/search-patient/',authorizeRole,searchPatient);
router.post('/close-session',authorizeRole,authorizeHc_provider,closeSession);
router.get('/',homeController);
router.post('/user-login',login);
router.get('/:filename([\\w/]+)',page);
router.get('/assets/*',assets);
router.post('/signup', signup)
export default router