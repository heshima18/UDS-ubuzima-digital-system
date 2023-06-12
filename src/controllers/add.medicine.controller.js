import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
const addmedicine = async (req,res)=>{
  try {
    let {name,unit,price} = req.body
      let uid = id()
      let insert = await query(`insert into medicines(id,name,price,unit)values(?,?,?,?)`,[uid,name,price,unit])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.mc_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default addmedicine