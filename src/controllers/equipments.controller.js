import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addEquipment = async (req,res)=>{
  try {
    let {name,price,unit} = req.body
      let uid = id()
      let insert = await query(`insert into equipments(id,name,price,unit)values(?,?,?,?)`,[uid,name,price,unit])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.ec_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const editEquipment = async (req,res)=>{
  try {
    let {name,price,unit,id} = req.body
      let insert = await query(`update equipments set name = ? ,price = ? ,unit = ? where id = ?`,[name,price,unit,id])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.eu_message})
    
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
