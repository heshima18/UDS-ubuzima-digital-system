import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
const sendMessage = async (req,res)=>{
  try {
    let {receiver,type,content,token} = req.body
      let uid = id()
      let user = authenticateToken(token)
      user = user.token.id
      let insert = await query(`insert into messages(id,user,receiver,type,content)values(?,?,?,?,?)`,[uid,user,receiver,type,content])
      if (!insert) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.ms_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default sendMessage