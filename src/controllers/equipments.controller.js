import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addEquipment = async (req,res)=>{
  try {
    let {name,price} = req.body
      let uid = id()
      let insert = await query(`insert into equipments(id,name,price)values(?,?,?)`,[uid,name,price])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.ec_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getEquipments = async (req,res)=>{
  let select = await query(`select * from equipments`,[])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  res.send({success: true, message: select})
}
export const getEquipment = async (req,res)=>{
  let {equipment} = req.params
  let select = await query(`select * from equipments where id = ?`,[equipment])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_med_404})
  res.send({success: true, message: select})
}
