import { roles } from "../utils/roles.controller";
import  authenticateToken  from '../controllers/token.verifier.controller'
import errorMessage from "../controllers/response.message.controller";
export const authorizeRole = async (req, res, next) => {
    try {
      const {token} = req.body;
      if (!token) {
        return res.status(401).send({success:false, message: 'token is missing' });
      }
      const decoded = authenticateToken(token);
      if (!decoded.success) return res.status(401).json({ message: 'Invalid token' });
      let f
      for (const role of roles) {
        if (role == decoded.token.role) {
             f = 1
        }
      }
      if (!f) {
        return res.status(403).send({ message: errorMessage._err_forbidden,success: false });
      }
      next()
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success:false });
    }
};