import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import errorMessage from './response.message.controller';
dotenv.config();
function authenticateToken(data) {
    const v = jwt.verify(data, process.env.SECRET_KEY, (err, decoded) => {
      let response;
      if (err) {
        response = { success: false, message: errorMessage.is_error };
        console.log(err)
      } else {
        response = { success: true, token: decoded };
      }
      return response;
    });
    return v;
  }
export let at = (req,res)=>{
  let {token} = req.params
  if (token == 'null' || !token) {
    return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
  }
  let t = authenticateToken(token)
  if (!t.success) {
    return res.status(401).send({success: false, message: errorMessage._err_forbidden})
  }
  t = t.token
  // delete t.id
  res.send({success: true,message: t})
}
export default authenticateToken