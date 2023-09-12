import { getSession } from "../controllers/credentials.verifier.controller";
import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";
export async function authorizeSession (req, res, next, extra){
    try {
      const { session,token } = req.body
      let user = authenticateToken(token)
      user = user.token
      if (!session) return res.status(403).send({ message: errorMessage._err_ms_404, success: false });
      let q = await getSession(session)
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if (q.length == 0) { return res.status(404).send({ message: errorMessage._err_ms_404, success: false }); }
      q = q[0]
      if (extra == 'isowner') {
        if (user.id != q.hc_provider) {
          return res.status(403).send({success: false, message: errorMessage._err_forbidden})
        }
      }
      if (extra == 'isopen') {
        if (q.status != 'open') {
          return res.status(403).send({success: false, message: errorMessage.err_unopen_session})
        }
      }
      if (extra == 'isnotclosed') {
        if (q.status == 'closed') {
          return res.status(403).send({success: false, message: errorMessage.err_closed_session})
        }
      }
      if (user.role == 'patient' || user.role == 'householder') {
        if (q.patient != user.id) {
          return res.status(403).send({success: false, message: errorMessage._err_forbidden})
        }
      }else if (user.role == 'cashier' && q.hospital != user.hospital) {
        return res.status(403).send({success: false, message: errorMessage._err_forbidden})
      }
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };