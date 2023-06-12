import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
const addAppointment = async (req,res)=>{
    try {
        let { hc_provider,subject,message,time,token } = req.body
        token = authenticateToken(token)
        token = token.token.id
        let insert = await query(`insert into appointments(id,patient,hc_provider,subject,message,time)values(?,?,?,?,?,?)`,[id(), token,hc_provider,subject,message,time])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.ab_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export default addAppointment