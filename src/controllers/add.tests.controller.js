import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
const addtest = async (req,res)=>{
  try {
    let {name,price} = req.body
      let uid = id()
      let insert = await query(`insert into tests(id,name,price)values(?,?,?)`,[uid,name,price])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.tc_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default addtest