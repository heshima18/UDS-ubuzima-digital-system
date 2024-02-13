import { getSession, getTest } from "../controllers/credentials.verifier.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";
import { addPati2fa, addPatiNextOfKin2fa } from "./user.2fa.access.middleware";
export const checkTest = async (req,res,next,action) =>{
    try {
        let { token,test,session } = req.body
        if (!test) {
            return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
        }
        const decoded = authenticateToken(token);
        let id = decoded.token.id
        let testinfo = await getTest(test.id),sessioninfo = await getSession(session)
        if (!testinfo) {
            return res.status(500).send({ message: errorMessage.is_error, success: false }); 
        }
        if (testinfo.length == 0) {
            return res.status(404).send({ message: errorMessage._err_test_404, success: false });
        }
        testinfo = testinfo[0]
        Object.assign(req,{params: {userid: sessioninfo.patient}})
        if (testinfo.type != 'quick test' && testinfo.department != decoded.token.department) {
            return res.status.send({success: false, message: errorMessage._err_forbidden})
        }
        if (action == 'patiNxtknAuth') {
            if (testinfo.reqSecAuth) {
                 return addPatiNextOfKin2fa(req,res,next,{type: 'test'})
            }
        }else if (action = 'patiAuth') {
            if (testinfo.reqPatiAuth) {
                return addPati2fa(req,res,next) 
            }
        }
        return next()
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
    }
}