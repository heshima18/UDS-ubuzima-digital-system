import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
const addSession = async (req,res)=>{
  try {
    let {patient,symptoms,tests,decision,departments,medicines,comment,token} = req.body
      let uid = id();
      let decoded = authenticateToken(token)
      let hc_provider = decoded.token.id 
      let hp = decoded.token.hospital
      let insert = await query(`insert into medical_history(id,patient,hospital,departments,hc_provider,symptoms,tests,medicines,decision,comment,status)values(?,?,?,?,?,?,?,?,?,?,?)`,[uid,patient,hp,JSON.stringify(departments),hc_provider,JSON.stringify(symptoms),JSON.stringify(tests),JSON.stringify(medicines),JSON.stringify(decision),comment,'open'])
      let itt,imt
      itt = 0
      imt = 0
      for (const test of tests) {
        var t = await query(`select price from tests where id = ?`, [test.id]);
        [t] = t
        itt +=t.price
      }
      for (const medicine of medicines) {
        var t = await query(`select price from medicines where id = ?`, [medicine.id]);
        [t] = t
        imt +=(t.price * medicine.qty)
      }
      console.log(itt,imt)
      let tt = itt+imt
      let insertpayment = await query(`insert into payments(id,user,session,amount,status)values(?,?,?,?,?)`,[id(),patient,uid,tt,'awaiting payment'])
      if (!insert || !insertpayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.session_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default addSession