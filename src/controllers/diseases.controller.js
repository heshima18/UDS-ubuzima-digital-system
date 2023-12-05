import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addDisease = async (req,res)=>{
    let { name } = req.body
    let insert = await query(`insert into diseases(id,name,status)values(?,?,?)`,[id(),name,'active'])
    if (!insert) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: errorMessage.dic_message})
}
export const getDiseases = async (req,res)=>{
    let select = await query(`select name,id,status from  diseases`,[])
    if (!select) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: select})
}
