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
import { authorizeAdmin } from '../middlewares/users.authoriser.middleware';
import addemployee from '../controllers/add.employee.controller';
import getHPinfo from '../controllers/hospital.profile.controller';
const router = express.Router({ strict: true });

router.post('/verify',verification)
router.post('/addhealthpost',authorizeRole,authorizeAdmin,addhospital)
router.post('/addemployee',authorizeRole,authorizeAdmin,addemployee)
router.get('/api/test',test);
router.post('/gethpinfo',authorizeRole,getHPinfo)
router.get('/styles/:filename',stylesheet);
router.get('/addadmin',addSuperAdmin);
router.get('/',homeController);
router.post('/login',login);
router.get('/:filename([\\w/]+)',page);
router.post('/signup', signup)
export default router