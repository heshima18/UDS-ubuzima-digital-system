import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addProvince = async (req,res)=>{
    try {
        let { name } = req.body
        let insert = await query(`insert into provinces(id,name)values(?,?)`,[id(), name])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.la_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addDistrict = async (req,res)=>{
    try {
        let { name,province } = req.body
        let insert = await query(`insert into districts(id,name,province)values(?,?,?)`,[id(), name, province])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.la_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addSector = async (req,res)=>{
    try {
        let { name,district } = req.body
        let insert = await query(`insert into sectors(id,name,district)values(?,?,?)`,[id(), name, district])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.la_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addCell = async (req,res)=>{
    try {
        let { name,sector } = req.body
        let insert = await query(`insert into cells(id,name,sector)values(?,?,?)`,[id(), name, sector])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.la_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}