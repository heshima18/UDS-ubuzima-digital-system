import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { checkInventory } from '../utils/check.inventory.controller';
const addInventory = async (req,res)=>{
  try {
    let {medicine,quantity,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      let uid = id()
      let obj = JSON.stringify({id: medicine, quantity: quantity})
      var avai = await checkInventory(hospital)
      avai = avai[0]
      var insert
      if (avai.total == 0) {
        insert = await query(`insert into inventories(id,hospital,medicines)values(?,?,?)`,[uid,hospital,`[${obj}]`])
      }else{
        insert = await query(`UPDATE inventories SET medicines = JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "quantity", ?)) WHERE hospital = ?`, [medicine, quantity, hospital]);

        // insert = await query(`update inventories set medicines = JSON_ARRAY_APPEND(medicines, '$', ?) where hospital = ?`,[obj,hospital])
      }
      
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.iu_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default addInventory