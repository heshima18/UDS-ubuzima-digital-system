import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addService = async (req,res)=>{
    try {
      let {name,unit,price} = req.body
        let uid = id()
        let insert = await query(`insert into services(id,name,price,unit)values(?,?,?,?)`,[uid,name,price,unit])
        if (!insert) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        res.send({success: true, message: errorMessage.sc_message})
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
  }
  export const editService = async (req,res)=>{
    try {
      let {name,unit,price,id} = req.body
        let insert = await query(`update services set name = ? ,price = ? ,unit = ? where id = ?`,[name,price,unit,id])
        if (!insert) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        res.send({success: true, message: errorMessage.supd_message})
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
  }
  export const getServices = async (req,res)=>{
    let select = await query(`select * from services`,[])
    if (!select) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: select})
  }
export const getService = async (req,res)=>{
  let {service} = req.params
  let select = await query(`select * from services where id = ?`,[service])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_med_404})
  res.send({success: true, message: select})
}
