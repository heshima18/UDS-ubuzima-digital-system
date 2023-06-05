import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
const addSuperAdmin = async (req,res)=>{
  let username  = 'admin'
  let password = 'admin'
  let Full_name = 'Super admin'
  let email = 'dummyEmail@gmail.com'
  let phone = '0123456789'
  let av = await query(`select * from users where role = ?`,['super_admin'])
  if (!av) {
    res.send({success:false, message: errorMessage.is_error})
    return
  }
  if (!av.length) {
    let insert = await query(`insert into users(id,NID,email,phone,Full_name,username,password,role,status)values(?,?,?,?,?,?,?,?,?)`,[id(),0,email,phone,Full_name,username,password,'super_admin','active'])
    if (!insert) {
        res.send({success:false, message: errorMessage.is_error})
        return
    }
  }else{
    return res.send({success: false, message: 'super admin was not added due to the availability of the super admin'})

  }
  res.send({success: true, message: 'super admin created sucessfully'})
}
export default addSuperAdmin