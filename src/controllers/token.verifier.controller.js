import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();
function authenticateToken(data) {
    const v = jwt.verify(data, process.env.SECRET_KEY, (err, decoded) => {
      let response;
      if (err) {
        response = { success: false, message: err };
        console.log(err)
      } else {
        response = { success: true, token: decoded };
      }
      return response;
    });
    return v;
  }
export default authenticateToken