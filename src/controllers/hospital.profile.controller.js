import query from './query.controller'
import errorMessage from './response.message.controller'
const getHPs = async (req,res)=>{
  try {
      let response = await query(`SELECT hospitals.name AS hospital_name, 
      CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', users.id, 'name', users.Full_name, 'position', users.role)), ']') AS employees FROM hospitals LEFT JOIN users ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$') GROUP BY hospitals.id, hospitals.name;`)
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const hospital of response) {
        response[response.indexOf(hospital)].employees = JSON.parse(hospital.employees) 
      }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default getHPs