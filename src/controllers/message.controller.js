import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { io } from '../socket.io/connector.socket.io';

export const sendMessage = async (req,res)=>{
  try {
    const sid = id();
    let {receiver,type,content,token,extra,title,controller} = req.body
    if (controller.looping) {
      for (const ids of controller.recipients) {
          let uid = id()
          let decoded = authenticateToken(token)
          let user = decoded.token.id
          let insert = await query(`insert
           into messages
           (id,user,receiver,type,title,content,addins,sessionid)
           values(?,?,?,?,?,?,?,?)`,
           [uid,user,ids,type,title,content,JSON.stringify(extra),sid])
           const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === ids)
           if (recipientSocket) {
               recipientSocket.emit('message',{id: uid,session: sid,type,title,content,sender:{name:decoded.token.Full_name,id:user},extra})
           }else{
               console.log('recepient is not online')
           }
          if (!insert) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
          }
          res.send({success: true, message: errorMessage.ms_message})     
        }
      }else{
        let uid = id()
        let decoded = authenticateToken(token)
        let user = decoded.token.id
        let insert = await query(`insert
         into messages
         (id,user,receiver,type,title,content,addins,sessionid)
         values(?,?,?,?,?,?,?,?)`,
         [uid,user,receiver,type,title,content,JSON.stringify(extra),sid])
         const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === receiver)
         if (recipientSocket) {
             recipientSocket.emit('message',{type,title,content,sender:{name:decoded.token.Full_name,id:user},extra})
         }else{
             console.log('recepient is not online')
         }
        if (!insert) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        res.send({success: true, message: errorMessage.ms_message})

      }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getMessages = async(req,res) =>{
  try {
    let { token } = req.body
    token = authenticateToken(token);
    if (!token.success) return res.status(500).send(errorMessage.is_error)
    let user = token.token.id
    let q = await query(`select
    COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', users.Full_name, '","id": "', users.id,'"}')), ']'), 'N/A') AS sender,
    messages.id,	
    messages.type,	
    messages.title,	
    messages.content,	
    messages.addins,
    messages.status,	
    messages.dateadded
    FROM
    messages
    INNER JOIN users ON messages.user = users.id
    where receiver = ? GROUP BY messages.id order by messages.dateadded desc`,[user])
    if (!q) return res.status(500).send(errorMessage.is_error)
    if (!q.length) return res.send({success:true, message: q})
    for (const message of q) {
      q[q.indexOf(message)].sender = JSON.parse(message.sender)[0];
      if (message.addins) {
        q[q.indexOf(message)].addins = JSON.parse(message.addins);  
      }
    }
    res.send({success:true, message: q})
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorMessage.is_error)
  }
}
export const markAsSeen = async(req,res) =>{
  try {
    let { token,message } = req.body
    token = authenticateToken(token);
    if (!token.success) return res.status(500).send(errorMessage.is_error)
    let user = token.token.id
    let q = await query(`UPDATE messages SET status = ?, dateadded = (select dateadded from messages where id = ?) where receiver = ? and id = ?`,['seen',message,user,message])
    if (!q) return res.status(500).send(errorMessage.is_error)
    res.send({success:true, message: errorMessage.me_message})
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorMessage.is_error)
  }
}
