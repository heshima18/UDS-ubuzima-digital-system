import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import { checkArrayAvai } from './credentials.verifier.controller';
export const addDepartment = async (req,res)=>{
    let { name } = req.body
    let insert = await query(`insert into departments(id,name)values(?,?)`,[id(),name])
    if (!insert) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: errorMessage.dc_message})
}
export const getDepartments = async (req,res)=>{
    let select = await query(`select name,id from  departments`,[])
    if (!select) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: select})
}
export const addDepartmentToHp = async (req,res)=>{
    try {
      let {department,hospital} = req.body
        let ArrayAvai = await checkArrayAvai('hospitals','departments',department,'id',hospital);
        if (!ArrayAvai) return res.status(500).send({success: false, message: errorMessage.is_error})
        if (ArrayAvai.length) {
          return res.send({success: false, message: errorMessage.err_entr_avai})
        }
        let update = await query(`UPDATE hospitals SET departments = JSON_ARRAY_APPEND(departments, '$', ?) where hospitals.id = ?`,[department,hospital]);
        if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
        if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_hc_404})
        res.send({success: true, message: errorMessage.dc_message})
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
  }
  export const removeDepartmentFromHospital = async (req,res)=>{
    try {
        let {hospital, department} = req.body
        let ArrayAvai = await checkArrayAvai('hospitals','departments',department,'id',hospital);
        if (!ArrayAvai) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (!ArrayAvai.length) {
            return res.send({success: false, message: errorMessage.err_entr_not_avai})
        }
        let update = await query(`UPDATE hospitals SET departments = JSON_REMOVE(departments,JSON_UNQUOTE(JSON_SEARCH(departments, 'one',?))) where hospitals.id = ?`,[department,hospital]);
        if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
        res.send({success: true, message: errorMessage.entr_removed})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
  }