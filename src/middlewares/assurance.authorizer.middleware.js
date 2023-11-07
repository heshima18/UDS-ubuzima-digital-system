import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";
export const authorizeUserAssurance = async (req, res, next) => {
    try {
      const {assurance,patient} = req.body
      if (!patient) return res.status(403).send({ message: errorMessage.assu_user_error_message, success: false });
      let q = await query(`select assurances from patients where id = ?`,[patient]);
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if (q.length == 0) return next();
      q = JSON.parse(q[0].assurances)
      for (const assuranceinfo of q) {
        if (assuranceinfo.id == assurance) {
           if (assuranceinfo.status == 'eligible') {
            return next();
           }else{
            console.log('not eligible for using this assurance');
            return  res.status(401).send({ message: errorMessage.assu_user_error_message, success: false });
           }
        }
      }
      if(assurance != null) {
        console.log('this assurance is not available');
        return res.status(401).send({ message: errorMessage.assu_user_error_message, success: false });}
      return next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };
  export const authorizeHospitalAssurance = async (req, res, next) => {
    try {
      const {assurance,token} = req.body
      let hospital = authenticateToken(token)
      hospital = hospital.token.hospital
      if (!hospital) {
        return res.status(404).send({ message: errorMessage._err_hc_404, success: false });
      } 
      if (!assurance && assurance != null) return res.status(403).send({ message: errorMessage.assu_hp_error_message, success: false });
      let q = await query(`select assurances from hospitals where id = ?`,[hospital]);

      
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if (q.length == 0) return res.status(403).send({ message: errorMessage._err_hc_404, success: false });
      q = q[0]
      q = JSON.parse(q.assurances)
      for (const assuranceinfo of q) {
        if (assuranceinfo == assurance && assurance != null) {
            return next();
        }
      }
      if(assurance != null) {
        return res.status(401).send({ message: errorMessage.assu_hp_error_message, success: false });}
      return next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };