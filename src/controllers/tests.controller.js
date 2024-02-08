import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addtest = async (req,res)=>{
  try {
    let {name,price,department,questions,type,reqSecAuth,reqPatiAuth} = req.body
      let uid = id()
      let insert = await query(`insert into tests(id,name,department,price,consent_fq,type,reqSecAuth,reqPatiAuth)values(?,?,?,?,?,?,?,?)`,[uid,name,department,price,JSON.stringify(questions),type,reqSecAuth,reqPatiAuth])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.tc_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const edittest = async (req,res)=>{
  try {
    let {name,price,department,questions,type,id,reqSecAuth,reqPatiAuth} = req.body
      let insert = await query(`update tests set name = ?,department = ? ,price = ?,consent_fq = ?,type = ?,reqSecAuth = ?,reqPatiAuth = ? where id = ?`,[name,department,price,JSON.stringify(questions),type,reqSecAuth,reqPatiAuth,id])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.tupd_message})
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getTests = async (req,res)=>{
  try {
    let select = await query(`select tests.id,tests.type,tests.name,reqSecAuth,reqPatiAuth,price,tests.consent_fq as questions,departments.name as department_name, departments.id as department from tests inner join departments on tests.department = departments.id`,[])
    if (!select) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    select = select.map(function (record) {
      if (JSON.parse(record.questions)) {
        record.questions = JSON.parse(record.questions)
      }else{
        record.questions = JSON.parse(record.questions)
      }
      return record
    })
    res.send({success: true, message: select})
  } catch (error) {
    console.log(error)
    return res.send({success: false, message: errorMessage.is_error})
  }
}
export const getTest = async (req,res)=>{
  try {
    let {test} = req.body
    let select = await query(`select tests.id,tests.name,tests.reqSecAuth,reqPatiAuth,price,departments.name as department_name,tests.consent_fq as questions, departments.id as department from tests inner join departments on tests.department = departments.id where tests.id = ?`,[test])
    if (!select) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        return
    }
    if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_test_404})
    select[0].questions = JSON.parse(select[0].questions)
  
    res.send({success: true, message: select[0]})
  } catch (error) {
    console.log(error)
    return res.send({success: false, message: errorMessage.is_error})
  }
}
export const getTestInfo = async function (test) {
  try {
      const select = await query(`
          SELECT tests.id, tests.name, price,reqSecAuth,reqPatiAuth, departments.name AS department_name, departments.id AS department
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
