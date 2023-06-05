import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
const addhospital = async (req,res)=>{
    let { name,departments,province,type,district,sector,cell,dependency } = req.body
    let insert = await query(`insert into hospitals(id,name,departments,province,type,district,sector,cell,dependency)values(?,?,?,?,?,?,?,?,?)`,[id(),name,JSON.stringify(departments),province,type,district,sector,cell,dependency])
    if (!insert) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: 'health service center created sucessfully'})
}
export default addhospital