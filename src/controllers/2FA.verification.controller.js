import query from './query.controller'
import errorMessage from './response.message.controller'
import addToken from './token.signer.controller'
const verification = async (req,res)=>{
    let {email,_2FA_code,uType}  = req.body,table
    if (!_2FA_code || _2FA_code == null) {
        return res.send({success: false, message: errorMessage._2FA_error_message})
    }
    if (!uType) {
        return res.status(404).send({success: false, message: errorMessage._err_u_404})
      }
      (uType == 'staff') ? table = 'users' : table = 'patients';  
    try {
        let select = await query(`select 
            id,
            status,
            email,
            Full_name,
            role
        from 
         ${table}
          where 
          (email = ? AND fa = ?)
          OR (username = ? AND fa = ?) 
          OR (phone = ? AND fa = ?) 
          OR (NID = ? AND fa = ?) 
          OR (id = ? AND fa = ?)`,
          [email,_2FA_code,email,_2FA_code,email,_2FA_code,email,_2FA_code,email,_2FA_code])
        if (!select) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (select.length > 0){
            [select] = select;
            if(select.role == 'patient' || select.role == 'householder') { 
                await query(`update patients set fa = null,status = "active" where id = ?`,[select.id])
            }else{
                var hospital =  await query(`select name,id from hospitals where JSON_CONTAINS(employees, JSON_QUOTE(?), '$')`,[select.id]);
                if(hospital.length > 1){
                    let h = []
                    for (const hos of hospital) {
                       h.push(hos.id) 
                    }
                    hospital = h
                }else if(hospital.length == 1){
                    [hospital] = hospital
                }
                query(`update users set fa = null ${(select.status === 'unverified')? ',status = "active"' : ''} where id = ?`,[select.id]);
            }
            let token 
            if (select.role != 'patient' && select.role != 'admin' && select.role != 'householder' && select.role != 'insurance_manager' && select.role != 'mohs') {
                if (!hospital.length && !('id' in hospital)) {
                   return res.status(403).send({success: false, message: errorMessage.emp_inassigned_to_hp_error_message}) 
                }
                let emp = await query('select department,departments.name as dep_name from users  inner join departments on departments.id = users.department where users.id = ?',[select.id])
                emp = emp[0]
                Object.assign(select,{department: emp.department, dep_name: emp.dep_name})
                if ('id' in hospital) {
                    token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status,hospital: hospital.id,department: select.department, dep_name: select.dep_name, title: select.title,hp_name:hospital.name,email: select.email, phone: select.phone, username: select.username })
                }else{
                    token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status,hospital,department: select.department,dep_name: select.dep_name, title: select.title,hp_name:'N/A',email: select.email, phone: select.phone, username: select.username  })
                }
            }else if (select.role == 'insurance_manager') {
                let assurance = await query(`select id,name from assurances where JSON_CONTAINS(managers, JSON_QUOTE(?),'$')`,[select.id])
                if(assurance.length > 1){
                    let h = []
                    for (const hos of assurance) {
                       h.push(hos.id) 
                    }
                    assurance = h
                }else if(assurance.length == 1){
                    [assurance] = assurance
                }else{
                    return res.status(403).send({success: false, message: errorMessage.emp_inassigned_to_assu_error_message})
                }
                token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status,title: select.title, assurance: assurance.id, assurance_name: assurance.name,email: select.email, phone: select.phone, username: select.username  })
            }else if (select.role == 'mohs') {
                if (select.extra) {
                    select.extra = JSON.parse(select.extra)
                    token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status,title: select.title, limit: select.extra.limit, location: select.extra.location})
                }
            }else{
                 token = addToken({id:select.id,Full_name:select.Full_name,role: select.role,status: select.status,email: select.email, phone: select.phone, username: select.username})
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