import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { DateTime } from 'luxon';

export const addhospital = async (req,res)=>{
  try {
    const leTime = DateTime.now();
    let now = leTime.setZone('Africa/Kigali');
    now = now.toFormat('yyyy-MM-dd HH:mm:ss')
    let { name,departments,province,type,district,sector,cell,dependency,phone } = req.body
    let uid = id()
    let insert = await query(`insert into hospitals(id,name,departments,province,type,phone,district,sector,cell,dependency,employees,assurances)values(?,?,?,?,?,?,?,?,?,?,?,?)`,[uid,name,JSON.stringify(departments),province,type,phone,district,sector,cell,dependency,'[]','[]'])
    if (!insert) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    res.send({success: true, message: 'health service center created sucessfully'})
    await query(`insert into inventories(id,hospital,medicines,tests,equipments,operations,services,date)values(?,?,?,?,?,?,?)`,[id(),uid,'[]','[]','[]','[]','[]',now])
  } catch (error) {
    res.status(500).send({success:false, message: errorMessage.is_error})
    console.log(error)
  }
}
export const getHPs = async (req,res)=>{
  try {
      let response = await query(`SELECT
      hospitals.name AS name,
      hospitals.id AS id,
      hospitals.type,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('province', provinces.name, 'district', districts.name, 'sector', sectors.name,'cell', cells.name)) as location,
      COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT CASE WHEN users.id IS NOT NULL THEN JSON_OBJECT('id', users.id, 'name', users.Full_name)ELSE NULL END SEPARATOR ','), ']'), '[]') AS employees,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments,
      COUNT(DISTINCT medical_history.id) AS total_patients
    FROM
      hospitals
      LEFT JOIN users ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
      INNER JOIN departments ON JSON_CONTAINS(hospitals.departments, JSON_QUOTE(departments.id), '$')
      LEFT JOIN medical_history ON medical_history.hospital = hospitals.id
      LEFT JOIN provinces ON hospitals.province = provinces.id
      LEFT JOIN districts ON hospitals.district = districts.id
      LEFT JOIN sectors ON hospitals.sector = sectors.id
      LEFT JOIN cells ON hospitals.cell = cells.id
    GROUP BY
      hospitals.id,
      hospitals.name;
     
            
    `)
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const hospital of response) {
        response[response.indexOf(hospital)].employees = JSON.parse(hospital.employees);
        response[response.indexOf(hospital)].location = JSON.parse(hospital.location);
        response[response.indexOf(hospital)].departments = JSON.parse(hospital.departments)  
      }
      if (response.length == 0) return res.status(404).send({success: true, message: errorMessage._err_hc_404})
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getHP = async (req,res)=>{
  try {
      let {hospital} = req.params
      if (!hospital) {
        let { token } = req.body
        token = authenticateToken(token)
        token = token.token
        hospital = token.hospital
    }
    if (!hospital) {
        return res.status(404).send({success: false, message: errorMessage._err_hc_404})
    }
      let response = await query(`SELECT
      hospitals.name AS name,
      hospitals.id AS id,
      hospitals.type,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('province', provinces.name, 'district', districts.name, 'sector', sectors.name,'cell', cells.name)) as location,
      COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name, 'title', users.title,'phone', users.phone)), ']'), '[]') AS employees,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments,
      COUNT(DISTINCT medical_history.id) AS total_patients
    FROM
      hospitals
      LEFT JOIN users ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
      INNER JOIN departments ON JSON_CONTAINS(hospitals.departments, JSON_QUOTE(departments.id), '$')
      LEFT JOIN medical_history ON medical_history.hospital = hospitals.id
      LEFT JOIN provinces ON hospitals.province = provinces.id
      LEFT JOIN districts ON hospitals.district = districts.id
      LEFT JOIN sectors ON hospitals.sector = sectors.id
      LEFT JOIN cells ON hospitals.cell = cells.id
      where hospitals.id = ?
    GROUP BY
      hospitals.id,
      hospitals.name;
          
    `,[hospital])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const hospital of response) {
        response[response.indexOf(hospital)].employees = JSON.parse(hospital.employees);
        response[response.indexOf(hospital)].location = JSON.parse(hospital.location);
        response[response.indexOf(hospital)].departments = JSON.parse(hospital.departments)  
      }
      if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_hc_404})
      res.send({success: true, message: response[0]})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getHPDeps = async (req,res)=>{
  try {
      let {hospital} = req.params
      if (!hospital) {
        let { token } = req.body
        token = authenticateToken(token)
        token = token.token
        hospital = token.hospital
    }
    if (!hospital) {
        return res.status(404).send({success: false, message: errorMessage._err_hc_404})
    }
      let response = await query(`SELECT
      COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'department', users.department)), ']'), '[]') AS employees,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments
    FROM
      hospitals
      LEFT JOIN users ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
      INNER JOIN departments ON JSON_CONTAINS(hospitals.departments, JSON_QUOTE(departments.id), '$')
      where hospitals.id = ?
    GROUP BY
      hospitals.id,
      hospitals.name;
          
    `,[hospital])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const hospital of response) {
        response[response.indexOf(hospital)].employees = JSON.parse(hospital.employees);
        response[response.indexOf(hospital)].departments = JSON.parse(hospital.departments)  
      }
      if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_hc_404})
      res.send({success: true, message: response[0]})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const searchHP = async (req,res)=>{
  try {
      let {hospital} = req.params
      let response = await query(`SELECT
      hospitals.name AS name,
      hospitals.id AS id,
      hospitals.type,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('province', provinces.name, 'district', districts.name, 'sector', sectors.name,'cell', cells.name)) as location,
      COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name, 'position', users.role)), ']'), '[]') AS employees,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments,
      COUNT(DISTINCT medical_history.id) AS total_patients
    FROM
      hospitals
      LEFT JOIN users ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
      INNER JOIN departments ON JSON_CONTAINS(hospitals.departments, JSON_QUOTE(departments.id), '$')
      LEFT JOIN medical_history ON medical_history.hospital = hospitals.id
      LEFT JOIN provinces ON hospitals.province = provinces.id
      LEFT JOIN districts ON hospitals.district = districts.id
      LEFT JOIN sectors ON hospitals.sector = sectors.id
      LEFT JOIN cells ON hospitals.cell = cells.id
      where hospitals.name like ?
    GROUP BY
      hospitals.id,
      hospitals.name;
          
    `,[`%${hospital}%`])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const hospital of response) {
        response[response.indexOf(hospital)].employees = JSON.parse(hospital.employees);
        response[response.indexOf(hospital)].location = JSON.parse(hospital.location);
        response[response.indexOf(hospital)].departments = JSON.parse(hospital.departments)  
      }
      if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_hc_404})
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export async function getCustomHps (ids){
  try {
      console.log(ids)
      let s = ''
      for (const hpid of ids) {
        if (ids.indexOf(hpid) == ids.length-1) {
          s+= `id = '${hpid}'`
        }else{
          s+= `id = '${hpid}' OR `
    
        }
      }
      let response = await query(`SELECT
      hospitals.name AS name,
      hospitals.id AS id,
      CONCAT(
        (SELECT name From provinces Where id = hospitals.province),' , ',
        (SELECT name From districts Where id = hospitals.district),' , ',
        (SELECT name From sectors Where id = hospitals.sector),' , ',
        (SELECT name From cells Where id = hospitals.cell)
      )as location
    FROM
      hospitals
    WHERE ${s}
    GROUP BY
      hospitals.id,
      hospitals.name;
          
    `,[])
      return response
  } catch (error) {
    console.log(error)
    return []
  }
}
export const hospitalASSU = async (req,res) =>{
  try {
    let { token } = req.body
    token = authenticateToken(token)
    token = token.token
    let hospital = token.hospital
    let response = await query(`SELECT
                                  CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', assu.id, 'name', assu.name,'coverage',assu.percentage_coverage)), ']') AS assurances
                                FROM
                                  hospitals
                                  INNER JOIN 
                                    assurances as assu on JSON_CONTAINS(hospitals.assurances, JSON_QUOTE(assu.id), '$')
                                WHERE
                                  hospitals.id = ?
    `,[hospital])
    if (!response) return res.status(500).send({success: true, message: errorMessage.is_error})
    response = response[0]
    response = JSON.parse(response.assurances)
    res.send({success: true, message: response})
  } catch (error) {
    console.log(error)
    return res.status(500).send({success: true, message: errorMessage.is_error})
  }
  
}
