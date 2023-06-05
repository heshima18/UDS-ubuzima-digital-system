
import  authenticateToken  from '../controllers/token.verifier.controller'
import query from "../controllers/query.controller";
import errorMessage from '../controllers/response.message.controller';
export const authorizeAdmin = async (req, res, next) => {
    try {
      const {token} = req.body;
      const decoded = authenticateToken(token);
      if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });

      let id = decoded.token.id
      let q = await query(`select role from users where id = ?`,[id])

      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      
      if (q.length == 0) return res.status(404).send({ message: errorMessage._err_u_404, success: false });

      [q] = q
      if (q.role != 'super_admin') return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
};