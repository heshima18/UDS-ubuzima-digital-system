import query from './query.controller'
import errorMessage from './response.message.controller'
import addToken from './token.signer.controller'
const verification = async (req,res)=>{
    let {email,_2FA_code,role}  = req.body
    try {
        let select = await query(`select id,status,email,Full_name,role from patients where email = ? AND fa = ?`,[email,_2FA_code])
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length === 0) {
            select = await query(`select id,status,email,Full_name,role,status from users where email = ? AND fa = ?`,[email,_2FA_code])
        }
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length > 0){
            [select] = select;
            (select.role == 'patient') ? await query(`update patients set fa = null,status = "active" where id = ?`,[select.id]): await query(`update users set fa = null, ${(select.status === 'unverified')? 'status = "active"' : ''} where id = ?`,[select.id]);
            return res.send({success: true, message: addToken({id:select.id,role: select.role,status: select.status})})
            
        } 
        res.send({success: false, message: errorMessage._2FA_error_message})
    } catch (error) {
        res.status(500).send({success: false, message: errorMessage.is_error})
        console.log(error)

    }
}
export default verification