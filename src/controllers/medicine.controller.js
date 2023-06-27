import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addmedicine = async (req,res)=>{
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
export const getMeds = async (req,res)=>{
  let select = await query(`select * from medicines`,[])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  res.send({success: true, message: select})
}
export const getMed = async (req,res)=>{
  let {medicine} = req.params
  let select = await query(`select * from medicines where id = ?`,[medicine])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_med_404})
  res.send({success: true, message: select})
}
export const searchMed = async (req,res)=>{
  let {medicine} = req.params
  let select = await query(`SELECT
  hospitals.name AS hospital,
  CONCAT(
    '[',
    GROUP_CONCAT(
      CONCAT(
        '{"id": "', m.id, '", "name": "', m.name, '", "quantity": "', JSON_UNQUOTE(JSON_EXTRACT(i.medicines, CONCAT('$[', indexes.idx, '].quantity'))), '"}'
      )
      ORDER BY m.id
      SEPARATOR ','
    ),
    ']'
  ) AS medicines
FROM inventories AS i
INNER JOIN hospitals ON i.hospital = hospitals.id
CROSS JOIN (
  SELECT 0 AS idx
  UNION ALL
  SELECT idx + 1
  FROM (
    SELECT 0 AS idx
    UNION ALL
    SELECT 1
    UNION ALL
    SELECT 2
    -- Add more UNION ALL statements for the maximum number of medicines in the inventories array
  ) AS indexes
) AS indexes
INNER JOIN medicines AS m ON JSON_EXTRACT(i.medicines, CONCAT('$[', indexes.idx, '].id')) = m.id
WHERE m.name LIKE ?
GROUP BY i.hospital;

`, [`%${medicine}%`]);

  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  for (const record of select) {
      select[select.indexOf(record)].medicines = JSON.parse(record.medicines)
  }
  res.send({success: true, message: select})
}
 