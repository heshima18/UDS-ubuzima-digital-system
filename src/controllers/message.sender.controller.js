import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { io } from '../socket.io/connector.socket.io';

const sendMessage = async (req,res)=>{
  try {
    let {receiver,type,content,token} = req.body
      let uid = id()
      let decoded = authenticateToken(token)
      let user = decoded.token.id
      let insert = await query(`insert
       into messages
       (id,user,receiver,type,content)
       values(?,?,?,?,?)`,
       [uid,user,receiver,type,content])
       const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === receiver)
       if (recipientSocket) {
           recipientSocket.emit('message',{type,content,sender:{name:decoded.token.Full_name,id:user}})
       }else{
           console.log('recepient is not online')
       }
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