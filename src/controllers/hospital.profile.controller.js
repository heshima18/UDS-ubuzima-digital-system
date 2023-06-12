import query from './query.controller'
import errorMessage from './response.message.controller'
const getHPs = async (req,res)=>{
  try {
      let response = await query(`SELECT
      hospitals.name AS hospital_name,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name, 'position', users.role)), ']') AS employees,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments,
      COUNT(DISTINCT medical_history.id) AS total_patients
    FROM
      hospitals
      INNER JOIN users ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
      INNER JOIN departments ON JSON_CONTAINS(hospitals.departments, JSON_QUOTE(departments.id), '$')
      LEFT JOIN medical_history ON medical_history.hospital = hospitals.id
    GROUP BY
      hospitals.id,
      hospitals.name;        
    `)
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const hospital of response) {
        response[response.indexOf(hospital)].employees = JSON.parse(hospital.employees);
        response[response.indexOf(hospital)].departments = JSON.parse(hospital.departments)  
      }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default getHPs