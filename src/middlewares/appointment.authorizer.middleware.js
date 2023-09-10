import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";

export const authorizeAppointmentAccess = async (req, res, next) => {
    try {
      const {token} = req.body;
        const appointment = req.params.id
        const decoded = authenticateToken(token);
        if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });
  
        let id = decoded.token.id
        let q = await query(`select time from appointments  where (hc_provider = ? OR patient = ?) AND id = ?`,[id,id,appointment])
  
        if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
        
        if (q.length == 0) return res.status(401).send({ message: errorMessage._err_forbidden, success: false });

        next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };