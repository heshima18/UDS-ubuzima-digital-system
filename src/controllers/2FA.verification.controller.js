import query from './query.controller'
import errorMessage from './response.message.controller'
import addToken from './token.signer.controller'
const verification = async (req,res)=>{
    let {email,_2FA_code}  = req.body
    try {
        let select = await query(`select id,status,email,Full_name,role from patients where email = ? AND fa = ?`,[email,_2FA_code])
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length === 0) {
            select = await query(`SELECT
             users.id,
             users.email,
             users.Full_name,
             users.role,
             users.status,
             users.department,
             departments.title 
             FROM
              users 
              LEFT JOIN departments on users.department = departments.id
            where email = ? AND fa = ?`,[email,_2FA_code])
        }
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length > 0){
            [select] = select;
            if(select.role == 'patient') { 
                await query(`update patients set fa = null,status = "active" where id = ?`,[select.id])
            }else{
                var hospital =  await query(`select id from hospitals where JSON_CONTAINS(employees, JSON_QUOTE(?), '$')`,[select.id]);
                [hospital] = hospital
                query(`update users set fa = null ${(select.status === 'unverified')? ',status = "active"' : ''} where id = ?`,[select.id]);
            }
            let token 
            if (select.role != 'patient' && select.role != 'Admin') {
                 token = addToken({id:select.id,role: select.role,status: select.status,hospital: hospital.id,department: select.department})
            }else{
                 token = addToken({id:select.id,role: select.role,status: select.status})
            }
            return res.send({success: true, message: token})
            
        } 
        res.send({success: false, message: errorMessage._2FA_error_message})
    } catch (error) {
        res.status(500).send({success: false, message: errorMessage.is_error})
        console.log(error)

    }
}
export default verification