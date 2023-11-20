import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addtest = async (req,res)=>{
  try {
    let {name,price,department} = req.body
      let uid = id()
      let insert = await query(`insert into tests(id,name,department,price)values(?,?,?,?)`,[uid,name,department,price])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.tc_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getTests = async (req,res)=>{
  let select = await query(`select tests.id,tests.name,price,departments.name as department_name, departments.id as department from tests inner join departments on tests.department = departments.id`,[])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  res.send({success: true, message: select})
}
export const getTest = async (req,res)=>{
  let {test} = req.params
  let select = await query(`select tests.id,tests.name,price,departments.name as department_name, departments.id as department from tests inner join departments on tests.department = departments.id where id = ?`,[test])
  if (!select) {
      res.status(500).send({success:false, message: errorMessage.is_error})
      return
  }
  if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_med_404})
  res.send({success: true, message: select})
}
export const getTestInfo = async function (test) {
  try {
      const select = await query(`
          SELECT tests.id, tests.name, price, departments.name AS department_name, departments.id AS department
          FROM tests
          INNER JOIN departments ON tests.department = departments.id
          WHERE tests.id = ?`,
          [test]
      );

      if (!select || select.length === 0) {
          return undefined;
      }

      return select[0];
  } catch (error) {
      throw error;
  }
};
