import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import generate2FAcode from './2FA.code.generator.controller'
import sendmail from "./2FA.sender.controller";
import {checkEmail, checkNID, checku_name} from './credentials.verifier.controller';
const addemployee = async (req,res)=>{
  try {
    let {username,password,Full_name,email,phone,nid,role,hospitalid} = req.body
      let uid = id()
      let des = await checkEmail(email,phone,'users')
      if(!des) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (des.length) return res.send({success: false, message : errorMessage._err_email_phone_avai});
      let des3 = await checku_name(username,'users')
      if(!des3) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (des3.length) return res.send({success: false, message : errorMessage._err_uname_avai});
      if (nid != null) {
        let des2 = await checkNID(nid,'users')
        if(!des2) return res.status(500).send({success: false, message : errorMessage.is_error});
        if (des2.length) return res.send({success: false, message : errorMessage._err_NID_avai});
      }
      let update = await query(`UPDATE hospitals SET employees = JSON_ARRAY_APPEND(employees, '$', ?) where hospitals.id = ?`,[uid,hospitalid]);
      if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
      if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_hc_404})
      let insert = await query(`insert into users(id,NID,email,phone,Full_name,username,password,role,status)values(?,?,?,?,?,?,?,?,?)`,[uid,nid,email,phone,Full_name,username,password,role,'unverified'])
      let FAcode = generate2FAcode()
      if (!insert) {
        res.send({success:false, message: errorMessage.is_error})
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      await query(`update users set  FA = ? where id = ?`,[FAcode,uid])
      let m  = sendmail(email,{subject: 'UDS your 2FA one time verification code', body: `${FAcode}`},Full_name,'2FA code')
      res.send({success: true, message: errorMessage.uc_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default addemployee