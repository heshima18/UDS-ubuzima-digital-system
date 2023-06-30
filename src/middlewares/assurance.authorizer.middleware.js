import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
export const authorizeUserAssurance = async (req, res, next) => {
    try {
      const {assurance,patient} = req.body
      if (!assurance || !patient) return res.status(403).send({ message: errorMessage.assu_user_error_message, success: false });
      let q = await query(`select assurances from patients where id = ?`,[patient]);
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      q = JSON.parse(q[0].assurances)
      for (const assuranceinfo of q) {
        if (assuranceinfo.id == assurance) {
           if (assuranceinfo.status == 'eligible') {
            return next();
           } 
        }
      }

      return res.status(401).send({ message: errorMessage.assu_user_error_message, success: false });
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };