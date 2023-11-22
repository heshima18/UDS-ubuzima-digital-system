import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import { selectPatient } from './patients.controller';
import authenticateToken from './token.verifier.controller';
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
  try {
    let {medicine} = req.params,{needle,entity,token} = req.body
    token  = authenticateToken(token)
    token = token.token
    if (!entity || !needle) {
      let p = await selectPatient(token.id)
      token = token.token
      entity = 'sector'
      needle = p.sector
    }
    console.log(needle,entity)
  //   let select = await query(`SELECT
  //   hospitals.name AS hospital,
  //   CONCAT(
  //     '[',
  //     GROUP_CONCAT(
  //       CONCAT(
  //         '{"id": "', m.id, '", "name": "', m.name, '", "quantity": "', JSON_UNQUOTE(JSON_EXTRACT(i.medicines, CONCAT('$[', indexes.idx, '].quantity'))), '"}'
  //       )
  //       ORDER BY m.id
  //       SEPARATOR ','
  //     ),
  //     ']'
  //   ) AS medicines
  // FROM inventories AS i
  // INNER JOIN hospitals ON i.hospital = hospitals.id
  // CROSS JOIN (
  //   SELECT 0 AS idx
  //   UNION ALL
  //   SELECT idx + 1
  //   FROM (
  //     SELECT 0 AS idx
  //     UNION ALL
  //     SELECT 1
  //     UNION ALL
  //     SELECT 2
  //     -- Add more UNION ALL statements for the maximum number of medicines in the inventories array
  //   ) AS indexes
  // ) AS indexes
  // INNER JOIN medicines AS m ON JSON_EXTRACT(i.medicines, CONCAT('$[', indexes.idx, '].id')) = m.id
  // WHERE m.name LIKE ?
  // GROUP BY i.hospital;
  
  // `, [`%${medicine}%`]);
      let select = await query(`SELECT
      JSON_OBJECT('id', h.id,'phone', h.phone, 'name', h.name, 'location', 
            CONCAT(
              (SELECT name From provinces Where id = h.province),' , ',
              (SELECT name From districts Where id = h.district),' , ',
              (SELECT name From sectors Where id = h.sector),' , ',
              (SELECT name From cells Where id = h.cell)
            ),
            'medicines',
            COALESCE(
              CONCAT('[',
                GROUP_CONCAT(
                  DISTINCT  CASE WHEN m.id IS NOT NULL THEN JSON_OBJECT('id', m.id, 'name', m.name,'unit', m.unit, 'price', (SELECT price FROM medicines where id = m.id))  ELSE NULL END SEPARATOR ',' 
                ),
              ']'),
            '[]')
      ) as hospitals
      FROM 
      inventories 
      INNER JOIN medicines as m
      INNER JOIN hospitals as h on h.id = inventories.hospital
      WHERE
       m.name LIKE ? 
      AND
       JSON_CONTAINS(inventories.medicines, JSON_OBJECT('id',m.id), '$') AND (select ${entity} from hospitals where id = h.id) = ? GROUP BY inventories.id
      `,[`%${medicine}%`,needle])
  
    if (!select) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    select = select.map((record)=>{
      record.hospitals = JSON.parse(record.hospitals)
      record.hospitals.medicines = JSON.parse(record.hospitals.medicines)
      return record.hospitals
    })
    res.send({success: true, message: select})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getMedInfo = async function (medicine) {
  try {
      const select = await query(`
          SELECT medicines.id, medicines.name, price
          FROM medicines
          WHERE medicines.id = ?`,
          [medicine]
      );

      if (!select || select.length === 0) {
          return undefined;
      }

      return select[0];
  } catch (error) {
      throw error;
  }
};

 