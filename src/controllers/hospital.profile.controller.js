import query from './query.controller'
import errorMessage from './response.message.controller'
export const getHPs = async (req,res)=>{
  try {
      let response = await query(`SELECT
      hospitals.name AS name,
      hospitals.id AS id,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('province', provinces.name, 'district', districts.name, 'sector', sectors.name,'cell', cells.name)) as location,
      IFNULL(
        CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name, 'position', users.role) SEPARATOR ','), ']'),
        '[]'
      ) AS employees,
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
      let response = await query(`SELECT
      hospitals.name AS name,
      hospitals.id AS id,
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
      res.send({success: true, message: response})
    
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