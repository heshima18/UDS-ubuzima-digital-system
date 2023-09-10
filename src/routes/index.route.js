import express from 'express';
import test from '../controllers/test.controller';
import {page} from '../controllers/page.controller';
import {assets, getSocketIo, pluginScripts, stylesheet, utilsScripts } from '../controllers/plugins.controller';
import addSuperAdmin from "../controllers/add.super.admin.controller";
import login from "../controllers/login.controller";
import verification from '../controllers/2FA.verification.controller';
import homeController from '../controllers/home.controller';
import signup from '../controllers/signup.controller';
import { authorizeRawRole, authorizeRole } from '../middlewares/roles.authorizer.middleware';
import { authorizeAdmin, authorizeCashier, authorizeHc_provider, authorizeHcp_ptnt, authorizeLaboratory_scientist, authorizePatient, authorizePatientToken, authorizePharmacist } from '../middlewares/users.authoriser.middleware';
import {addEmployeetoHp, addemployee, getEmployees, getHpEmployees} from '../controllers/employee.controller';
import { getHP, getHPs, searchHP,addhospital } from '../controllers/hospital.controller';
import {addSession, addSessionComment, addSessionDecision, addSessionEquipment, addSessionMedicine, addSessionOperation, addSessionService, addSessionTests, approvePayment, closeSession, getHc_pSessions, getHpsessions, getUsessions, markMedicineAsServed, session } from '../controllers/patient.session.controller';
import {addmedicine, getMed, getMeds, searchMed} from '../controllers/medicine.controller';
import {addDepartment, getDepartments} from '../controllers/departments.controller';
import {addtest,getTests} from '../controllers/tests.controller';
import {addAppointment, appointment, approveAppointment, declineAppointment, hcpAppointments, myAppointments} from '../controllers/appointment.controller';
import { CheckAppointmentTimer, getAppointmentETA } from '../middlewares/time.authorizer.middleware';
import { addCell, addDistrict, addProvince, addSector } from '../controllers/add.location.controller';
import getMap from '../controllers/get.locations.controller';
import { authorizeHospital } from '../middlewares/hospital.authorizer.middleware';
import {getInventory,addInventory} from '../controllers/inventory.controller';
import { getMessages, markAsSeen, sendMessage } from '../controllers/message.controller';
import { authorizeAppointmentAccess } from '../middlewares/appointment.authorizer.middleware';
import { authorizeSession } from '../middlewares/session.authorizer.middleware';
import { addUserAssurance, getPatient, getPatients } from '../controllers/patients.controller';
import { addAssurance, getAssurances } from '../controllers/assurance.controller';
import { authorizeUserAssurance } from '../middlewares/assurance.authorizer.middleware';
import { at } from '../controllers/token.verifier.controller';
import { io } from '../socket.io/connector.socket.io';
import { resend2FA } from '../controllers/2FA.resender.controller';
import { addService, getServices } from '../controllers/services.controller';
import { addOperation, getOperations } from '../controllers/operations.controller';
import { addEquipment, getEquipments } from '../controllers/equipments.controller';
import { titles } from '../utils/titles.controller';
import { checkTest } from '../middlewares/tests.middleware';
const router = express.Router({ strict: false });
router.post('/verify',verification)
router.post('/get-user-medical-history/:userid?',authorizeRole,authorizeHcp_ptnt,getUsessions)
router.post('/get-hospital-medical-history',authorizeRole,getHpsessions)
router.post('/get-hcp-sessions',authorizeRole,authorizeHc_provider,getHc_pSessions)
router.post('/session/:session',authorizeRole,session)
router.post('/addhealthpost',authorizeRole,authorizeAdmin,addhospital)
router.post('/add-appointment',authorizeRole,authorizeHc_provider,authorizePatient,CheckAppointmentTimer,addAppointment)
router.post("/addmedicine",authorizeRole,authorizeAdmin,addmedicine)
router.post("/addtest",authorizeRole,authorizeAdmin,addtest)
router.post("/add-service",authorizeRole,authorizeAdmin,addService)
router.post("/add-operation",authorizeRole,authorizeAdmin,addOperation)
router.post("/add-equipment",authorizeRole,authorizeAdmin,addEquipment)
router.post("/get-tests",authorizeRole,getTests)
router.post("/get-test/:test",authorizeRole,getTests)
router.post("/get-services",authorizeRole,getServices)
router.post("/get-equipments",authorizeRole,getEquipments)
router.post("/get-operations",authorizeRole,getOperations)
router.post("/add-province",authorizeRole,authorizeAdmin,addProvince)
router.post("/add-district",authorizeRole,authorizeAdmin,addDistrict)
router.post("/add-sector",authorizeRole,authorizeAdmin,addSector)
router.post("/add-assurance",authorizeRole,authorizeAdmin,addAssurance)
router.post("/add-assurance-to-user",authorizeRole,authorizePatientToken,addUserAssurance)
router.post("/add-session-test",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),checkTest,addSessionTests)
router.post("/add-session-medicine",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeHc_provider,addSessionMedicine)
router.post("/mark-as-served",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizePharmacist,markMedicineAsServed)
router.post("/add-session-equipment",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeHc_provider,addSessionEquipment)
router.post("/add-session-service",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeHc_provider,addSessionService)
router.post("/add-session-operation",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeHc_provider,addSessionOperation)
router.post("/add-session-comment",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeHcp_ptnt,addSessionComment)
router.post("/add-session-decisions",authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeHc_provider,addSessionDecision)
router.post("/add-cell",authorizeRole,authorizeAdmin,addCell)
router.post('/addemployee',authorizeRole,authorizeAdmin,authorizeHospital,addemployee)
router.post('/add-employee-to-hp',authorizeRole,authorizeAdmin,authorizeHospital,addEmployeetoHp)
router.post('/get-hp-employees',authorizeRole,authorizeHospital,getHpEmployees)
router.post('/get-employees',authorizeRole,authorizeAdmin,getEmployees)
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
router.post('/getmeds',authorizeRole,getMeds);
router.post('/approve-appointment',authorizeRole,authorizeHc_provider,approveAppointment);
router.post('/getAppointmentETA',authorizeRole,authorizeHc_provider,getAppointmentETA)
router.post('/decline-appointment',authorizeRole,authorizeHc_provider,declineAppointment);
router.post('/send-message',authorizeRole,sendMessage);
router.post('/get-messages',authorizeRole,getMessages);
router.post('/mark-as-seen',authorizeRole,markAsSeen);
router.post('/get-inventory',authorizeRole,getInventory);
router.post('/gethospitals',authorizeRole,getHPs)
router.post('/hospital/:hospital',authorizeRole,getHP)
router.post('/search-hospital/:hospital',authorizeRole,searchHP)
router.post('/add-department',authorizeRole,authorizeAdmin,addDepartment)
router.post('/get-departments',authorizeRole,authorizeAdmin,getDepartments)
router.get('/styles/:filename',stylesheet);
router.get('/plugins/:filename',pluginScripts);
router.get('/utils/:filename',utilsScripts);
router.get('/authenticateToken/:token',at);
router.get('/getSocketIo/:filename',getSocketIo);
router.get('/addadmin',addSuperAdmin);
router.post('/approve-payment',authorizeRole,(req,res,next) => authorizeSession(req,res,next,null),authorizeCashier,approvePayment);
router.post('/get-patients',authorizeRole,authorizeAdmin,getPatients);
router.post('/patient/:patient',authorizeRole,getPatient);
router.post('/close-session',authorizeRole,authorizeHc_provider,(req,res,next) => authorizeSession(req,res,next,'isowner'),closeSession);
router.get('/',homeController);
router.post('/user-login',login);
router.get('/assets/*',assets);
router.post('/api/signup',authorizeRawRole, signup)
router.post('/resend-2FA',resend2FA)
router.get('/:user/:filename*', (req, res) => page(req, res, 'admin'));
router.post('/get-titles',authorizeRole,authorizeAdmin, (req, res) => res.send({success:true, message: titles}));

router.get('/:filename*',(req, res)=> page(req, res, null));
export default router