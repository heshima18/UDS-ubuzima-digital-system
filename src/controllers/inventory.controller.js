import query from './query.controller'
import errorMessage from './response.message.controller'
import authenticateToken from './token.verifier.controller';
import { checkInventory } from '../utils/check.inventory.controller';
import id from "./randomInt.generator.controller";
export const addInventory = async (req,res)=>{
  try {
    let {medicine,quantity,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      let uid = id();
      let obj = JSON.stringify({id: medicine, quantity: parseInt(quantity)})
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

export const getInventory = async (req,res)=>{
  try {
    let {token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      var select = await query(`
      SELECT
      i.medicines as raw_medicines,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"id": "', m.id, '","name": "', m.name, '"}')), ']') AS medicines
      FROM inventories AS i
      INNER JOIN medicines AS m ON JSON_CONTAINS(i.medicines, JSON_OBJECT('id', m.id), '$')
      WHERE i.hospital = ?
      GROUP BY i.hospital;`,[hospital,hospital])  
      if (!select) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if(select.length == 0)return res.send({success: true, message: select})
      select = select[0]
      select.medicines = JSON.parse(select.medicines)
      select.raw_medicines = JSON.parse(select.raw_medicines)
      for (const medicine of select.medicines) {
        Object.assign(select.medicines[select.medicines.indexOf(medicine)],{quantity: select.raw_medicines[select.medicines.indexOf(medicine)].quantity})
      }
      delete select.raw_medicines
      res.send({success: true, message: select})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
