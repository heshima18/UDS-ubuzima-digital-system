import query from './query.controller'
import errorMessage from './response.message.controller'
import addToken from './token.signer.controller'
const verification = async (req,res)=>{
    let {email,_2FA_code}  = req.body
    try {
        let select = await query(`select 
            id,
            status,
            email,
            Full_name,
            role
        from 
         patients
          where 
          (email = ? AND fa = ?)
          OR (username = ? AND fa = ?) 
          OR (phone = ? AND fa = ?) 
          OR (NID = ? AND fa = ?) 
          OR (id = ? AND fa = ?)`,
          [email,_2FA_code,email,_2FA_code,email,_2FA_code,email,_2FA_code,email,_2FA_code])
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length === 0) {
            select = await query(`SELECT
             users.id,
             users.email,
             users.Full_name,
             users.role,
             users.status,
             users.department,
             users.title 
             FROM
              users 
            where 
            (email = ? AND fa = ?)
            OR (username = ? AND fa = ?) 
            OR (phone = ? AND fa = ?) 
            OR (NID = ? AND fa = ?) 
            OR (id = ? AND fa = ?)`,
            [email,_2FA_code,email,_2FA_code,email,_2FA_code,email,_2FA_code,email,_2FA_code])
        }
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length > 0){
            [select] = select;
            if(select.role == 'patient') { 
                await query(`update patients set fa = null,status = "active" where id = ?`,[select.id])
            }else{
                var hospital =  await query(`select id from hospitals where JSON_CONTAINS(employees, JSON_QUOTE(?), '$')`,[select.id]);
                if(hospital.length > 1){
                    let h = []
                    for (const hos of hospital) {
                       h.push(hos.id) 
                    }
                    hospital = h
                }else if(hospital.length == 1){
                    [hospital] = hospital
                    hospital = hospital.id
                }
                query(`update users set fa = null ${(select.status === 'unverified')? ',status = "active"' : ''} where id = ?`,[select.id]);
            }
            let token 
            if (select.role != 'patient' && select.role != 'Admin') {
                 token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status,hospital: hospital,department: select.department, title: select.title})
            }else{
                 token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status})
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