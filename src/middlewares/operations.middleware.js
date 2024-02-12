import { getOperation, getSession } from "../controllers/credentials.verifier.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";
import { addPati2fa, addPatiNextOfKin2fa } from "./user.2fa.access.middleware";

export const checkOperation = async (req,res,next,action) =>{
    try {
        let { token,operation,session } = req.body
        if (!operation) {
            return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
        }
        const decoded = authenticateToken(token);
        let id = decoded.token.id
        let operationinfo = await getOperation(operation.id),sessioninfo = await getSession(session)
        if (!sessioninfo || !sessioninfo.length) {
            return res.status(404).send({ message: errorMessage._err_sess_404, success: false });
        }
        sessioninfo = sessioninfo[0]

        if (!operationinfo) {
            return res.status(500).send({ message: errorMessage.is_error, success: false }); 
        }
        if (operationinfo.length == 0) {
            return res.status(404).send({ message: errorMessage._err_operation_404, success: false });
        }
        Object.assign(req,{params: {userid: sessioninfo.patient}})
        operationinfo = operationinfo[0]
        if (action == 'patiNxtknAuth') {
            if (operationinfo.reqSecAuth) {
                 return addPatiNextOfKin2fa(req,res,next,{type: 'operation'})
            }
        }else if (action = 'patiAuth') {
            if (operationinfo.reqPatiAuth) {
                return addPati2fa(req,res,next) 
            }
        }
        return res.status(500).send({ message: errorMessage.is_error, success: false });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
    }
}