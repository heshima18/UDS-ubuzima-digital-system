import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addAssurance = async (req,res)=>{
    try {
        let { name } = req.body
        let insert = await query(`insert into assurances(id,name)values(?,?)`,[id(), name])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.assu_added_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const getAssurances = async (req,res)=>{
    try {
        let select = await query(`select * from assurances`)
        if (!select) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: select})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
