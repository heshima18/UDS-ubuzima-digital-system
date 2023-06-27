import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
export const authorizeSession = async (req, res, next) => {
    try {
      const session = req.body.session
      if (!session) return res.status(403).send({ message: errorMessage._err_ms_404, success: false });
      let q = await query(`select * from medical_history where id = ?`,[session])
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if (q.length == 0) return res.status(404).send({ message: errorMessage._err_ms_404, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };