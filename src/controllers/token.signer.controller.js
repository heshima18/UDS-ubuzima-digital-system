import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
dotenv.config();
function addToken(userInfo) {
    try {
        const token = jwt.sign(userInfo, process.env.SECRET_KEY);
          return token;
    } catch (error) {
        console.log(error)
        return null
    }
      
}
export default addToken