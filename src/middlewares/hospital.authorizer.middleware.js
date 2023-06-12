import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
export const authorizeHospital = async (req, res, next) => {
    try {
      const hospital = req.body.hospital
      if (!hospital) return res.status(403).send({ message: errorMessage._err_h_404, success: false });
      let q = await query(`select * from hospitals where id = ?`,[hospital])
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if (q.length == 0) return res.status(404).send({ message: errorMessage._err_hc_404, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };