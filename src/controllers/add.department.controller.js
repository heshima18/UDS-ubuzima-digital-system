import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
const addDepartment = async (req,res)=>{
    let { name } = req.body
    let insert = await query(`insert into departments(id,name)values(?,?)`,[id(),name])
    if (!insert) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: errorMessage.dc_message})
}
export default addDepartment