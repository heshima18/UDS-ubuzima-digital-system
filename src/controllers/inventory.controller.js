import query from './query.controller'
import errorMessage from './response.message.controller'
import authenticateToken from './token.verifier.controller';
import { checkInventory } from '../utils/check.inventory.controller';
import id from "./randomInt.generator.controller";
import { checkArrayAvai, checkObjectAvai } from './credentials.verifier.controller';
export const addInventory = async (req,res)=>{
  try {
    let {medicines,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      let uid = id();
      let obj = JSON.stringify(medicines)
      var avai = await checkInventory(hospital)
      avai = avai[0]
      var insert
      let found
      if (avai.total == 0) {
        insert = await query(`insert into inventories(id,hospital,medicines)values(?,?,?)`,[uid,hospital,obj])
      }else{
        for (const medicine of medicines) {
          let objectAvai = await checkObjectAvai('inventories','medicines','id',medicine.id,'hospital',hospital)
          if (!objectAvai) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
          }
          if (!objectAvai.length) {
            insert = await query(`UPDATE inventories SET medicines = JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "quantity", ?, "price", ?)) WHERE hospital = ?`, [medicine.id, medicine.quantity,Number(medicine.price), hospital]);
          }else{
            found = 1
          }
        }
      }
      
      if (!insert && !found) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (found) {
        return res.send({success: false, message: errorMessage.err_entr_avai})
      }
      res.send({success: true, message: errorMessage.iu_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addInventoryTests = async (req,res)=>{
  try {
    let {tests,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      var insert
      let found
      for (const test of tests) {
        let objectAvai = await checkObjectAvai('inventories','tests','id',test.id,'hospital',hospital)
        if (!objectAvai) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (!objectAvai.length) {
          insert = await query(`UPDATE inventories SET tests = JSON_ARRAY_APPEND(tests, '$', JSON_OBJECT("id", ?, "price", ?)) WHERE hospital = ?`, [test.id, test.price, hospital]);
        }else{
          found = 1
        }
      }
      if (!insert && !found) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (found) {
        return res.send({success: false, message: errorMessage.err_entr_avai})
      }
      res.send({success: true, message: errorMessage.iu_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addInventoryOperations = async (req,res)=>{
  try {
    let {operations,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      var insert
      let found
      for (const operation of operations) {
        let objectAvai = await checkObjectAvai('inventories','operations','id',operation.id,'hospital',hospital)
        if (!objectAvai) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (!objectAvai.length) {
          insert = await query(`UPDATE inventories SET operations = JSON_ARRAY_APPEND(operations, '$', JSON_OBJECT("id", ?, "price", ?)) WHERE hospital = ?`, [operation.id, operation.price, hospital]);
        }else{
          found = 1
        }
      }
      if (!insert && !found) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (found) {
        return res.send({success: false, message: errorMessage.err_entr_avai})
      }
      res.send({success: true, message: errorMessage.iu_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addInventoryEquipments = async (req,res)=>{
  try {
    let {equipments,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      var insert
      let found
      for (const equipment of equipments) {
        let objectAvai = await checkObjectAvai('inventories','equipments','id',equipment.id,'hospital',hospital)
        if (!objectAvai) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (!objectAvai.length) {
          insert = await query(`UPDATE inventories SET equipments = JSON_ARRAY_APPEND(equipments, '$', JSON_OBJECT("id", ?, "quantity", ?)) WHERE hospital = ?`, [equipment.id, equipment.quantity, hospital]);
        }else{
          found = 1
        }
      }
      if (!insert && !found) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (found) {
        return res.send({success: false, message: errorMessage.err_entr_avai})
      }
      res.send({success: true, message: errorMessage.iu_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addInventoryServices = async (req,res)=>{
  try {
    let {services,token} = req.body
      token = authenticateToken(token)
      token = token.token
      let hospital = token.hospital
      var insert
      let found
      for (const service of services) {
        let objectAvai = await checkObjectAvai('inventories','services','id',service.id,'hospital',hospital)
        if (!objectAvai) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (!objectAvai.length) {
          insert = await query(`UPDATE inventories SET services = JSON_ARRAY_APPEND(services, '$', JSON_OBJECT("id", ?, "price", ?)) WHERE hospital = ?`, [service.id, service.price, hospital]);
        }else{
          found = 1
        }
      }
      if (!insert && !found) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (found) {
        return res.send({success: false, message: errorMessage.err_entr_avai})
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
      if (!hospital) return res.status(403).send({ message: errorMessage._err_forbidden,success: false });
      var select = await query(`
      SELECT
      i.id,
      i.medicines as raw_medicines,
      i.tests as raw_tests,
      i.operations as raw_operations,
      i.equipments as raw_equipments,
      i.services as raw_services,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT  CASE WHEN m.id IS NOT NULL THEN JSON_OBJECT('id', m.id, 'name', m.name,'unit', m.unit)  ELSE NULL END SEPARATOR ',' 
          ),
        ']'),
      '[]') AS medicines,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT  CASE WHEN t.id IS NOT NULL THEN JSON_OBJECT('id', t.id, 'name', t.name)  ELSE NULL END SEPARATOR ',' 
          ),
        ']'),
      '[]') AS tests,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT  CASE WHEN o.id IS NOT NULL THEN JSON_OBJECT('id', o.id, 'name', o.name)  ELSE NULL END SEPARATOR ',' 
          ),
        ']'),
      '[]') AS operations,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT  CASE WHEN s.id IS NOT NULL THEN JSON_OBJECT('id', s.id, 'name', s.name, 'unit', s.unit)  ELSE NULL END SEPARATOR ',' 
          ),
        ']'),
      '[]') AS services,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT  CASE WHEN eq.id IS NOT NULL THEN JSON_OBJECT('id', eq.id, 'name', eq.name,'unit', eq.unit)  ELSE NULL END SEPARATOR ',' 
          ),
        ']'),
      '[]') AS equipments
      FROM inventories AS i
      LEFT JOIN medicines AS m ON JSON_CONTAINS(i.medicines, JSON_OBJECT('id', m.id), '$')
      LEFT JOIN equipments as eq ON JSON_CONTAINS(i.equipments, JSON_OBJECT('id', eq.id), '$')
      LEFT JOIN services as s ON JSON_CONTAINS(i.services, JSON_OBJECT('id', s.id), '$')
      LEFT JOIN operations as o ON JSON_CONTAINS(i.operations, JSON_OBJECT('id', o.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(i.tests, JSON_OBJECT('id', t.id), '$')
      WHERE i.hospital = ?
      GROUP BY i.hospital;`,[hospital,hospital])  
      if (!select) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if(select.length == 0)return res.send({success: true, message: {medicines: [],tests: [],operations: [],services: [],equipments: []}})
      select = select[0]
      select.medicines = JSON.parse(select.medicines)
      select.tests = JSON.parse(select.tests)
      select.operations = JSON.parse(select.operations)
      select.equipments = JSON.parse(select.equipments)
      select.services = JSON.parse(select.services)
      select.raw_medicines = JSON.parse(select.raw_medicines)
      select.raw_tests = JSON.parse(select.raw_tests)
      select.raw_operations = JSON.parse(select.raw_operations)
      select.raw_equipments = JSON.parse(select.raw_equipments)
      select.raw_services = JSON.parse(select.raw_services)



      for (const medicine of select.medicines) {
        let rawM = select.raw_medicines.find(function (med) {
          return med.id == medicine.id
        })
        Object.assign(select.medicines[select.medicines.indexOf(medicine)],{quantity: rawM.quantity,price: rawM.price})
      }
      for (const test of select.tests) {
        Object.assign(select.tests[select.tests.indexOf(test)],{price: select.raw_tests[select.tests.indexOf(test)].price})
      }
      for (const operation of select.operations) {
        Object.assign(select.operations[select.operations.indexOf(operation)],{price: select.raw_operations[select.operations.indexOf(operation)].price})
      }
      for (const service of select.services) {
        Object.assign(select.services[select.services.indexOf(service)],{price: select.raw_services[select.services.indexOf(service)].price})
      }
      for (const equipment of select.equipments) {
        Object.assign(select.equipments[select.equipments.indexOf(equipment)],{quantity: select.raw_equipments[select.equipments.indexOf(equipment)].quantity})
      }
      delete select.raw_medicines
      delete select.raw_operations
      delete select.raw_tests
      delete select.raw_equipments
      delete select.raw_services

      res.send({success: true, message: select})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const removeItemFromInventory = async (req,res)=>{
  try {
      let {type, inventory, needle} = req.body
      let ArrayAvai = await checkObjectAvai('inventories',type,'id',needle,'id',inventory)
      if (!ArrayAvai) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (!ArrayAvai.length) {
          return res.send({success: false, message: errorMessage.err_entr_not_avai})
      }
      let update = await query(`UPDATE inventories SET ${type} = JSON_REMOVE(${type},JSON_UNQUOTE(JSON_SEARCH(${type}, 'one',?))) where inventories.id = ?`,[needle,inventory]);
      if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
      res.send({success: true, message: errorMessage.entr_removed})
  } catch (error) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      console.log(error)
  }
}
export const editItemFromInventory = async (req,res)=>{
  try {
      let {type, inventory, needle,upinfo} = req.body
      let ArrayAvai = await checkObjectAvai('inventories',type,'id',needle,'id',inventory)
      if (!ArrayAvai) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      if (!ArrayAvai.length) {
        return res.send({success: false, message: errorMessage.err_entr_not_avai})
      }
      let  inv = await getInventoryEntry(inventory,type)
      let update
      if (type == 'medicines') {
        inv = inv.map(function (medicine) {
          if(medicine.id == needle){
            return {id: medicine.id, quantity: Number(upinfo.quantity),price : Number(upinfo.price)}
          }else{
            return {id: medicine.id, quantity: Number(medicine.quantity),price : Number(medicine.price)}
          }
        })
      }else if (type == 'tests') {
        inv = inv.map(function (test) {
          if(test.id == needle){
            return {id: test.id, price: Number(upinfo.price)}
          }else{
            return {id: test.id, price: Number(test.price)}
          }
        })
      }else if (type == 'operations') {
        inv = inv.map(function (operation) {
          if(operation.id == needle){
            return {id: operation.id, price: Number(upinfo.price)}
          }else{
            return {id: operation.id, price: Number(operation.price)}
          }
        })
      }else if (type == 'services') {
        inv = inv.map(function (service) {
          if(service.id == needle){
            return {id: service.id, price: Number(upinfo.price)}
          }else{
            return {id: service.id, price: Number(service.price)}
          }
        })
      }else if (type == 'equipments') {
        inv = inv.map(function (equipment) {
          if(equipment.id == needle){
            return {id: equipment.id, quantity: Number(upinfo.quantity)}
          }else{
            return {id: equipment.id, quantity: Number(equipment.quantity)}
          }
        })
      }else{
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      update = await query(`
        UPDATE inventories 
        SET ${type} = ?
        WHERE inventories.id = ?
    `, [JSON.stringify(inv), inventory]);
      if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
      res.send({success: true, message: errorMessage.entr_updated})
  } catch (error) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      console.log(error)
  }
}
export async function getInventoryEntry(inventory,entry) {
  try {
    let q = await query(`SELECT
    i.id,
    i.${entry} as raw_${entry},
    COALESCE(
      CONCAT('[',
        GROUP_CONCAT(
          DISTINCT  CASE WHEN m.id IS NOT NULL THEN JSON_OBJECT('id', m.id, 'name', m.name, 'price', m.price) ELSE NULL END SEPARATOR ',' 
        ),
      ']'),
    '[]') AS ${entry}
    FROM inventories AS i
    LEFT JOIN ${entry} AS m ON JSON_CONTAINS(i.${entry}, JSON_OBJECT('id', m.id), '$')
    WHERE i.id = ? OR i.hospital = ?
    GROUP BY i.id;`,[inventory,inventory]);
    q = q[0]
    q[entry] = JSON.parse(q[entry])
    q[`raw_${entry}`] = JSON.parse(q[`raw_${entry}`])  
    for (const entr of q[entry]) {
      Object.assign(q[entry][q[entry].indexOf(entr)],{quantity: q[`raw_${entry}`][q[entry].indexOf(entr)].quantity})
      Object.assign(q[entry][q[entry].indexOf(entr)],{price: q[`raw_${entry}`][q[entry].indexOf(entr)].price})
    }
    delete q[`raw_${entry}`]
    return q[entry]
  } catch (error) {
    console.log(error)
    return undefined
  }
}
