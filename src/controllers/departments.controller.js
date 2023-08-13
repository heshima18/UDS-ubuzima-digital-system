import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
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