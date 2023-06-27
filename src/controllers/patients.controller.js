import query from './query.controller'
import errorMessage from './response.message.controller'
import authenticateToken from './token.verifier.controller';
export const getPatients = async (req,res)=>{
        try {
            let select = await query(`
                SELECT id,Full_name,phone,email,nid,status
                FROM patients
            `)
            if (!select) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            res.send({success: true, message: select})
        } catch (error) {
            console.log(error)
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
}
