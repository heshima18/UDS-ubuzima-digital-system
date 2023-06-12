
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
      if (q.role != 'Admin') return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
};
export const authorizePatient = async (req, res, next) => {
  try {
    const patient = req.body.patient
    if (!patient) return res.status(403).send({ message: errorMessage._err_p_404, success: false });
    let q = await query(`select role from patients where id = ?`,[patient])

    if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
    
    if (q.length == 0) return res.status(404).send({ message: errorMessage._err_p_404, success: false });
    next();
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success: false });
  }
};
export const authorizePatientToken = async (req, res, next) => {
  try {
    let {token} = req.body
    const decoded = authenticateToken(token);
      if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });

      let id = decoded.token.id
    let q = await query(`select role from patients where id = ?`,[id])

    if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
    
  if (q.length == 0) return res.status(404).send({ message: errorMessage._err_p_404, success: false });
    next();
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success: false });
  }
};
export const authorizeHc_provider = async (req, res, next) => {
  try {
    const {token} = req.body;
      const decoded = authenticateToken(token);
      if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });

      let id = decoded.token.id
      let q = await query(`select role from users where id = ?`,[id])

      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      
      if (q.length == 0) return res.status(404).send({ message: errorMessage._err_u_404, success: false });

      [q] = q
      if (q.role != 'hc_provider') return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
      next();
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success: false });
  }
};
export const authorizePharmacist = async (req, res, next) => {
  try {
    const {token} = req.body;
      const decoded = authenticateToken(token);
      if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });

      let id = decoded.token.id
      let q = await query(`select role from users where id = ?`,[id])

      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      
      if (q.length == 0) return res.status(404).send({ message: errorMessage._err_u_404, success: false });
      [q] = q
      if (q.role != 'pharmacist') return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
      next();
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success: false });
  }
};