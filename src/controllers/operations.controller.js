import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addOperation = async (req,res)=>{
  try {
    let {name,price,department,questions} = req.body
      let uid = id()
      let insert = await query(`insert into operations(id,name,price,department,consent_fq)values(?,?,?,?,?)`,[uid,name,price,department,JSON.stringify(questions)])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.oc_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getOperations = async (req,res)=>{
  let select = await query(`select operations.id,operations.name,price,departments.name as department_name, departments.id as department from operations inner join departments on operations.department = departments.id`,[])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  res.send({success: true, message: select})
}
export const getOperation = async (req,res)=>{
  let {operation} = req.body
  let select = await query(`select operations.id,operations.name,operations.consent_fq as questions,price,departments.name as department_name, departments.id as department from operations inner join departments on operations.department = departments.id where operations.id = ?`,[operation])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_ope_404})
  select[0].questions = JSON.parse(select[0].questions)
  res.send({success: true, message: select[0]})
}
