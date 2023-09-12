import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import generate2FAcode from './2FA.code.generator.controller'
import sendmail from "./2FA.sender.controller";
import {checkEmail, checkNID, checku_name, checkPhone} from './credentials.verifier.controller';
import authenticateToken from './token.verifier.controller';
import { titles } from '../utils/titles.controller';
import { roles } from '../utils/roles.controller';

export const addemployee = async (req,res)=>{
  try {
      let {Full_name,email,phone,nid,hospital,department,title,license} = req.body
      let role,password = '123456',username = Full_name.replace(/ /gi,".");
      username+= id().substring(2,4);
      for (const tit of titles) {
        if (title == Object.keys(tit)[0]) {
          let key = tit[Object.keys(tit)[0]]
          role = roles[key]
        }
      }
      let uid = id()
      if (!email) {
        email = null
      }else{
        let des = await checkEmail(email,'users')
        if(!des) return res.status(500).send({success: false, message : errorMessage.is_error});
        if (des.length) return res.send({success: false, message : errorMessage._err_email_avai});
      }
      if (!phone) {
        phone = null
      }else{
        let des4 = await checkPhone(phone,'users')
        if(!des4) return res.status(500).send({success: false, message : errorMessage.is_error});
        if (des4.length) return res.send({success: false, message : errorMessage._err_phone_avai});
      }
      if (!nid) {
        nid = null
      }else{
        let des2 = await checkNID(nid,'users')
        if(!des2) return res.status(500).send({success: false, message : errorMessage.is_error});
        if (des2.length) return res.send({success: false, message : errorMessage._err_NID_avai});
      }
      
      let des3 = await checku_name(username,'users')
      if(!des3) return res.status(500).send({success: false, message : errorMessage.is_error});
      if (des3.length) return res.send({success: false, message : errorMessage._err_uname_avai});
      if (hospital) {
        let update = await query(`UPDATE hospitals SET employees = JSON_ARRAY_APPEND(employees, '$', ?) where hospitals.id = ?`,[uid,hospital]);
        if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_hc_404})
      }
      let insert = await query(`insert into users(id,NID,email,phone,Full_name,username,password,role,department,status,title,license)values(?,?,?,?,?,?,?,?,?,?,?,?)`,[uid,nid,email,phone,Full_name,username,password,role,department,'unverified',title,license])
      let FAcode = generate2FAcode()
      if (!insert) {
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
export const getHpEmployees = async (req,res)=>{
  let {token} = req.body
  let decoded = authenticateToken(token)
  decoded = decoded.token
  var hospital =  decoded.hospital;
  (!hospital)?  hospital = req.body.hospital: null;
  try {
      let select = await query(`
          SELECT
           users.id,
           users.online,
           users.Full_name,
           users.phone,
           users.email,
           users.title,
           GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)) AS department
          FROM 
           users inner join hospitals on JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
           left join departments on users.department = departments.id
          WHERE 
           hospitals.id = ?
           GROUP BY users.id
      `,[hospital])
      if (!select) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      for (const employee of select) {
        select[select.indexOf(employee)].department = JSON.parse(employee.department)
      }
      res.send({success: true, message: select})
  } catch (error) {
      console.log(error)
      return res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getEmployees = async (req,res)=>{
  try {
      let select = await query(`
          SELECT
           users.id,
           users.online,
           users.Full_name as names,
           users.phone,
           users.email,
           users.title as position,
           users.nid,
           users.status,
           hospitals.name as hp,
           COALESCE(departments.name, 'N/A')  as department
          FROM 
           users inner join hospitals on JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
           left join departments on users.department = departments.id
      `,[])
      if (!select) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: select})
  } catch (error) {
      console.log(error)
      return res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getEmployeesByRole = async (req,res)=>{
  try {
      let {role} = req.params
      let select = await query(`
          SELECT
           users.id,
           users.online,
           users.Full_name as name,
           users.phone,
           users.email,
           users.title as position,
           users.nid,
           users.status
          FROM 
           users
          WHERE
           role = ? 
           
          `,[role])
      if (!select) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: select})
  } catch (error) {
      console.log(error)
      return res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addEmployeetoHp = async (req,res)=>{
  try {
    let {employee,hospital} = req.body
      let update = await query(`UPDATE hospitals SET employees = JSON_ARRAY_APPEND(employees, '$', ?) where hospitals.id = ?`,[employee,hospital]);
      if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
      if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_hc_404})
      res.send({success: true, message: errorMessage.uc_added_to_hp_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}