import express from 'express';
import test from '../controllers/test.controller';
import {page} from '../controllers/page.controller';
import {assets, getLuxon, getSocketIo, pluginScripts, stylesheet, utilsScripts } from '../controllers/plugins.controller';
import addSuperAdmin from "../controllers/add.super.admin.controller";
import login from "../controllers/login.controller";
import verification from '../controllers/2FA.verification.controller';
import homeController from '../controllers/home.controller';
import signup from '../controllers/signup.controller';
import { authorizeRawRole, authorizeRole } from '../middlewares/roles.authorizer.middleware';
import { authorizeAdmin, authorizeAssuranceManager, authorizeCashier, authorizeHc_provider, authorizeHcp_ptnt, authorizeLaboratory_scientist, authorizeMultipleRoles, authorizePatient, authorizePatientToken, authorizePharmacist } from '../middlewares/users.authoriser.middleware';
import {addEmployeetoAssurance, addEmployeetoHp, addemployee, editProfile, getEmployeeProfile, getEmployees, getEmployeesByRole, getHpEmployees, removeEmployeFromHospital} from '../controllers/employee.controller';
import { getHP, getHPs, searchHP,addhospital, hospitalASSU, getHPDeps } from '../controllers/hospital.controller';
import {TransferInteralSession, addSession, addSessionComment, addSessionDecision, addSessionEquipment, addSessionMedicine, addSessionOperation, addSessionService, addSessionSymptoms, addSessionTests, approveAssuPayment, approvePayment, assuranceMH, closeSession, getDailyHpSessions, getHc_pSessions, getHpsessions, getUsessions, markMedicineAsServed, session, testPay } from '../controllers/patient.session.controller';
import {addmedicine, editmedicine, getMed, getMeds, searchMed} from '../controllers/medicine.controller';
import {addDepartment, addDepartmentToHp, getDepartments, removeDepartmentFromHospital} from '../controllers/departments.controller';
import {addtest,edittest,getTest,getTests} from '../controllers/tests.controller';
import {addAppointment, appointment, approveAppointment, declineAppointment, hcpAppointments, myAppointments} from '../controllers/appointment.controller';
import { CheckAppointmentTimer, getAppointmentETA } from '../middlewares/time.authorizer.middleware';
import { addCell, addDistrict, addProvince, addSector } from '../controllers/add.location.controller';
import getMap from '../controllers/get.locations.controller';
import { authorizeHospital } from '../middlewares/hospital.authorizer.middleware';
import {getInventory,addInventory, addInventoryTests, addInventoryOperations, addInventoryEquipments, addInventoryServices, removeItemFromInventory, editItemFromInventory} from '../controllers/inventory.controller';
import { getMessages, getSentMessages, markAsSeen, sendMessage } from '../controllers/message.controller';
import { authorizeAppointmentAccess } from '../middlewares/appointment.authorizer.middleware';
import { authorizeSession } from '../middlewares/session.authorizer.middleware';
import { addPatiBg, addPatientFP, addUserAssurance, editPatientProfile, getPatient, getPatients } from '../controllers/patients.controller';
import { addAssurance, addEquipmentToAssuranceRestrictedList, addMedicineToAssuranceRestrictedList, addOperationToAssuranceRestrictedList, addServiceToAssuranceRestrictedList, addTestToAssuranceRestrictedList, assurance, getAssurances, removeItemFromAssurancelist,assuranceHP, addassuranceToHp } from '../controllers/assurance.controller';
import { authorizeHospitalAssurance, authorizeUserAssurance } from '../middlewares/assurance.authorizer.middleware';
import { at } from '../controllers/token.verifier.controller';
import { io } from '../socket.io/connector.socket.io';
import { resend2FA } from '../controllers/2FA.resender.controller';
import { addService, editService, getServices } from '../controllers/services.controller';
import { addOperation, editOperation, getOperation, getOperations } from '../controllers/operations.controller';
import { addEquipment, editEquipment, getEquipments } from '../controllers/equipments.controller';
import { organiseTitles, titles } from '../utils/titles.controller';
import { checkTest } from '../middlewares/tests.middleware';
import { DGResinsightsStats, DGinsightsStats, insightsStats } from '../controllers/insights.controller';
import { addPati2fa } from '../middlewares/user.2fa.access.middleware';
import { createTransfer, viewTransfer } from '../controllers/transfer.controller';
import getAdminNmbrs from '../controllers/admin-numbers.controller';
import { checkFPAvai } from '../middlewares/fp.avai.middleware';
import { addDisease, getDiseases } from '../controllers/diseases.controller';
const router = express.Router({ strict: false });
router.post('/verify',verification)
router.post('/getnmbrs',authorizeRole,authorizeAdmin,getAdminNmbrs)
router.post('/addhealthpost',authorizeRole,authorizeAdmin,addhospital)
router.post('/add-appointment',authorizeRole,authorizeHc_provider,authorizePatient,CheckAppointmentTimer,addAppointment)
router.post("/addmedicine",authorizeRole,authorizeAdmin,addmedicine)
router.post("/editmedicine",authorizeRole,authorizeAdmin,editmedicine)
router.post("/addtest",authorizeRole,authorizeAdmin,addtest)
router.post("/edittest",authorizeRole,authorizeAdmin,edittest)
router.post("/add-service",authorizeRole,authorizeAdmin,addService)
router.post("/editservice",authorizeRole,authorizeAdmin,editService)

router.post("/add-operation",authorizeRole,authorizeAdmin,addOperation)
router.post("/edit-operation",authorizeRole,authorizeAdmin,editOperation)
router.post("/add-equipment",authorizeRole,authorizeAdmin,addEquipment)
router.post("/editequipment",authorizeRole,authorizeAdmin,editEquipment)
router.post("/get-tests",authorizeRole,getTests)
router.post("/get-test",authorizeRole,getTest)
router.post("/get-services",authorizeRole,getServices)
router.post("/get-equipments",authorizeRole,getEquipments)
router.post("/get-operations",authorizeRole,getOperations)
router.post("/operation",authorizeRole,getOperation)
router.post("/add-province",authorizeRole,authorizeAdmin,addProvince)
router.post("/add-district",authorizeRole,authorizeAdmin,addDistrict)
router.post("/add-sector",authorizeRole,authorizeAdmin,addSector)
router.post("/add-assurance",authorizeRole,authorizeAdmin,addAssurance)
router.post("/assurance/:assurance?",authorizeRole,assurance)
router.post("/aMtA/",authorizeRole,authorizeAdmin,addEmployeetoAssurance)
router.post("/aMeDtA/",authorizeRole,authorizeAssuranceManager,addMedicineToAssuranceRestrictedList)
router.post("/aTesTA/",authorizeRole,authorizeAssuranceManager,addTestToAssuranceRestrictedList)
router.post("/aOpeTA/",authorizeRole,authorizeAssuranceManager,addOperationToAssuranceRestrictedList)
router.post("/aSerTA/",authorizeRole,authorizeAssuranceManager,addServiceToAssuranceRestrictedList)
router.post("/aEquTA/",authorizeRole,authorizeAssuranceManager,addEquipmentToAssuranceRestrictedList)
router.post("/rAenrs/",authorizeRole,authorizeAssuranceManager,removeItemFromAssurancelist)
router.post("/gAsSuMH/",authorizeRole,authorizeAssuranceManager,assuranceMH)
router.post("/gAsSuHP/",authorizeRole,authorizeAssuranceManager,assuranceHP)
router.post("/gHosPiAsSu/",authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof']),hospitalASSU)
router.post("/add-hospi-assu/",authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof']),addassuranceToHp)
router.post("/add-user-fp",authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['hc_provider','receptionist']),checkFPAvai,addPatientFP)

router.get("/tp",testPay)
router.post("/add-assurance-to-user",authorizeRole,authorizePatientToken,addUserAssurance)
// session routes
router.post('/get-user-medical-history/:userid?',authorizeRole,addPati2fa,getUsessions)
router.post('/get-hospital-medical-history',authorizeRole,getHpsessions)
router.post('/get-hcp-sessions',authorizeRole,authorizeHc_provider,getHc_pSessions)
router.post('/get-hp-daily-sessions',authorizeRole,authorizeHospital,getDailyHpSessions)
router.post('/session/:session',authorizeRole,authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isuserorhcp'),session)
router.post("/add-session-test",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),checkTest,addSessionTests)
router.post("/add-session-medicine",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,addSessionMedicine)
router.post("/mark-as-served",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizePharmacist,markMedicineAsServed)
router.post("/add-session-equipment",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,addSessionEquipment)
router.post("/add-session-service",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,addSessionService)
router.post("/add-session-operation",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,addSessionOperation)
router.post("/add-session-comment",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),(req,res,next) =>authorizeMultipleRoles(req,res,next,['hc_provider','pharmacist']),addSessionComment)
router.post("/add-session-decisions",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,addSessionDecision)
router.post("/add-session-symptoms",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,addSessionSymptoms)
router.post("/crTrns",authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotclosed'),authorizeHc_provider,createTransfer)
router.post("/getTrNsfr",authorizeRole,viewTransfer)
router.post('/close-session',authorizeRole,authorizeHc_provider,(req,res,next) => authorizeSession(req,res,next,'isowner'),(req,res,next) => authorizeSession(req,res,next,'ismyfacilty'),closeSession);
router.post('/tsfOnsp',authorizeRole,authorizeHc_provider,(req,res,next) => authorizeSession(req,res,next,'ismyfacilty'),TransferInteralSession);
router.post('/approve-assurance-payment',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof']),approveAssuPayment);
router.post('/approve-payment',authorizeRole,(req,res,next) => authorizeSession(req,res,next,'isnotopen'),authorizeCashier,approvePayment);
router.post('/addsession',authorizeRole,authorizeHc_provider,authorizePatient,authorizeUserAssurance,authorizeHospitalAssurance,addSession)
// end of session routes
router.post("/add-cell",authorizeRole,authorizeAdmin,addCell)
router.get('/get-map',getMap);
router.get('/get-assurances',getAssurances);
router.post('/appointment/:id',authorizeRole,authorizeAppointmentAccess,appointment)
router.post('/addPatiBg',authorizeRole,authorizePatient,addPatiBg)
router.get('/api/test',test);
router.post('/my-appointments',authorizeRole,authorizePatientToken,myAppointments)
router.post('/hcp-appointments',authorizeRole,authorizeHc_provider,hcpAppointments)
router.post('/appointment/:id',authorizeRole,authorizeHc_provider,appointment)
router.post('/search-medicine/:medicine',authorizeRole,searchMed);
router.get('/medicine/:medicine',getMed);

// =========================================  > EMPLOYEES ROUTES <  ===========================================================================


router.post('/addemployee',authorizeRole,authorizeAdmin,(req,res,next) => authorizeHospital(req,res,next,'isoptional'),addemployee)
router.post('/add-employee-to-hp',authorizeRole,authorizeAdmin,authorizeHospital,addEmployeetoHp)
router.post('/get-hp-employees',authorizeRole,authorizeHospital,getHpEmployees)
router.post('/get-employees',authorizeRole,authorizeAdmin,getEmployees)
router.post('/employee/:employee',authorizeRole,getEmployeeProfile)
router.post('/get-employees-by-role/:role',authorizeRole,authorizeAdmin,getEmployeesByRole)


// =========================================  >END OF EMPLOYEES ROUTES <  ===========================================================================


// =========================================  >INVENTORY ROUTES <  ===========================================================================



router.post('/add-inventory',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof','pharmacist']),addInventory);
router.post('/add-inventory-tests',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof','pharmacist']),addInventoryTests);
router.post('/add-inventory-operations',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof','pharmacist']),addInventoryOperations);
router.post('/add-inventory-equipments',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof','pharmacist']),addInventoryEquipments);
router.post('/add-inventory-services',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof','pharmacist']),addInventoryServices);
router.post('/get-inventory',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['dof','pharmacist']),getInventory);
router.post("/rIFromInv/",authorizeRole,(req,res,next)=> authorizeMultipleRoles(req,res,next,['pharmacist','dof']),removeItemFromInventory)
router.post("/eInvEnt",authorizeRole,(req,res,next)=> authorizeMultipleRoles(req,res,next,['pharmacist','dof']),editItemFromInventory)


// =========================================  >END OF INVENTORY ROUTES <  ===========================================================================



router.post('/getmeds',authorizeRole,getMeds);
router.post('/approve-appointment',authorizeRole,authorizeHc_provider,approveAppointment);
router.post('/getAppointmentETA',authorizeRole,authorizeHc_provider,getAppointmentETA)
router.post('/decline-appointment',authorizeRole,authorizeHc_provider,declineAppointment);
router.post('/send-message',authorizeRole,sendMessage);
router.post('/get-messages',authorizeRole,getMessages);
router.post('/get-sent-messages',authorizeRole,getSentMessages);
router.post("/edit-profile",authorizeRole,editProfile)
router.post("/edit-patient-profile",authorizeRole,editPatientProfile)
router.post('/mark-as-seen',authorizeRole,markAsSeen);
router.post('/insights',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['mohs']),insightsStats);
router.post('/hp-insights',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['director_general']),DGinsightsStats);
router.post('/hp-res-insights',authorizeRole,(req,res,next) => authorizeMultipleRoles(req,res,next,['director_general']),DGResinsightsStats);
router.post('/gethospitals',authorizeRole,getHPs)
router.post('/hospital/:hospital?',authorizeRole,getHP)
router.post('/hpDeps/:hospital?',authorizeRole,getHPDeps)

router.post('/search-hospital/:hospital',authorizeRole,searchHP)
router.post('/add-department',authorizeRole,authorizeAdmin,addDepartment)
router.post('/add-department-to-hp',authorizeRole,authorizeAdmin,addDepartmentToHp)
router.post('/remove-employee-from-hp',authorizeRole,authorizeAdmin,removeEmployeFromHospital)
router.post('/remove-department-from-hp',authorizeRole,authorizeAdmin,removeDepartmentFromHospital)

router.post('/get-departments',authorizeRole,authorizeAdmin,getDepartments)
router.post('/get-diseases',authorizeRole,authorizeAdmin,getDiseases)
router.post('/add-disease',authorizeRole,authorizeAdmin,addDisease)
router.get('/styles/:filename',stylesheet);
router.get('/plugins/:filename',pluginScripts);
router.get('/utils/:filename',utilsScripts);
router.get('/authenticateToken/:token',at);
router.get('/getSocketIo/:filename',getSocketIo);
router.get('/getLuxon/:filename',getLuxon);

router.get('/addadmin',addSuperAdmin);
router.post('/get-patients',authorizeRole,authorizeAdmin,getPatients);
router.post('/patient/:patient?',authorizeRole,getPatient);
router.get('/',homeController);
router.post('/user-login',login);
router.get('/assets/*',assets);
router.post('/api/signup',authorizeRawRole, signup)
router.post('/resend-2FA',resend2FA)
router.get('/:user/:filename*', (req, res) => page(req, res, 'admin'));
router.post('/get-titles',authorizeRole,authorizeAdmin, organiseTitles);

router.get('/:filename*',(req, res)=> page(req, res, null));
export default router