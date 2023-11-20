import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import generate2FAcode from './2FA.code.generator.controller'
import sendmail from "./2FA.sender.controller";
import {checkEmail, checkHouseHolder, checkNID, checkPhone, checku_name} from './credentials.verifier.controller';
const signup = async (req,res)=>{
  try {
    let {username,password,Full_name,email,phone,assurances,dob,role,province,district,sector,cell,nid,gender,householder,fp_data} = req.body
    if (!householder) {
      householder = null
    }else{
      let des0 = await checkHouseHolder(householder)
      if(!des0) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (!des0.length) return res.send({success: false, message : errorMessage._err_hH_404});
      householder = des0[0].id
    }
    if (!email) {
      email = null
    }else{
      let des = await checkEmail(email,'patients')
      if(!des) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (des.length) return res.send({success: false, message : errorMessage._err_email_avai});
    }
    if (!phone) {
      phone = null
    }else{
      let des4 = await checkPhone(phone,'patients')
      if(!des4) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (des4.length) return res.send({success: false, message : errorMessage._err_phone_avai});
    }
    if (!nid) {
      nid = null
    }else{
      let des2 = await checkNID(nid,'patients')
      if(!des2) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (des2.length) return res.send({success: false, message : errorMessage._err_NID_avai});
    }
    
    let des3 = await checku_name(username,'patients')
    if(!des3) return res.status(500).send({success: false, message : errorMessage.is_error});
    if (des3.length) return res.send({success: false, message : errorMessage._err_uname_avai});
    let uid = id();
    let insert = await query(`insert into patients(id,NID,email,phone,Full_name,username,password,DOB,resident_province,resident_district,resident_sector,resident_cell,status,assurances,gender,role,householder)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[uid,nid,email,phone,Full_name,username,password,dob,province,district,sector,cell,'unverified',JSON.stringify(assurances),gender,role,householder])
    let FAcode = generate2FAcode();
    if (!insert) {
      res.send({success:false, message: errorMessage.is_error})
      return
    }
    await query(`update patients set  FA = ? where id = ?`,[FAcode,uid])
    let m  = sendmail(email,{subject: 'UDS your 2FA one time verification code', body: `${FAcode}`},Full_name,'2FA code')
    if (fp_data) {
      let insertfp = await query(`insert into fingerprints (id,user,data) values(?,?,?)`,[id(),uid,fp_data])
    }
    res.send({success: true, message: errorMessage.uc_message})
    
  } catch (error) {
    console.log(error)
    res.send({success:false, message: errorMessage.is_error})
  }
}
export default signup