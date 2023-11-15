import { roles } from "../utils/roles.controller";
import  authenticateToken  from '../controllers/token.verifier.controller'
import errorMessage from "../controllers/response.message.controller";
import query from "../controllers/query.controller";
export const authorizeRole = async (req, res, next) => {
    try {
      const {token} = req.body;
      if (!token) {
        return res.status(401).send({success:false, message: 'token is missing' });
      }
      const decoded = authenticateToken(token);
      if (!decoded.success) return res.status(401).json({ message: 'Invalid token' });
      let role = decoded.token.role
      role = roles.find(function (rl) {
        return rl == role
      })
      if (!role) {
        return res.status(403).send({ message: errorMessage._err_forbidden,success: false });
      }
      if (role != 'patient' && role != 'householder') {
        role = await query('select id, role from users where id = ? AND role = ?',[decoded.token.id,role])
        if (!role.length) {
          return res.status(403).send({ message: errorMessage._err_forbidden,success: false });
        }
      }else{
        role = await query('select id, role from patients where id = ? AND role = ?',[decoded.token.id,role])
        if (!role.length) {
          return res.status(403).send({ message: errorMessage._err_forbidden,success: false });
        }
      }
      next()
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success:false });
    }
};
export const authorizeRawRole = async (req, res, next) => {
  try {
    let {role} = req.body;
    if (!role) {
      return res.status(401).send({success:false, message: 'role is missing' });
    }
    role = roles.find(function (rl) {
      return rl == role
    })
    if (!role) {
      return res.status(403).send({ message: errorMessage._err_forbidden,success: false });
    }
    next()
  } catch (error) {
      console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success:false });
  }
};