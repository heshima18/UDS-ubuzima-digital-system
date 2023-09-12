import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { io } from '../socket.io/connector.socket.io';
import { getMessage } from './credentials.verifier.controller';

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
           (id,user,receiver,type,title,content,addins,sessionid,dateadded)
           values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP())`,
           [uid,user,ids,type,title,content,JSON.stringify(extra),sid])
           const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === ids)
           if (recipientSocket) {
               recipientSocket.emit('message',{id: uid,session: sid,type,title,content,sender:{name:decoded.token.Full_name,id:user},extra,dateadded: new Date})
           }else{
               console.log('recepient is not online')
           }
          if (!insert) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
          }
      }
      res.send({success: true, message: errorMessage.ms_message})     
      }else{
        let uid = id()
        let decoded = authenticateToken(token)
        let user = decoded.token.id
        let insert = await query(`insert
         into messages
         (id,user,receiver,type,title,content,addins,sessionid,dateadded)
         values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP())`,
         [uid,user,receiver,type,title,content,JSON.stringify(extra),sid])
         const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === receiver)
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
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export async function ioSendMessage(messageInfo) {
  let uid = id()
  const sid = id();
  let insert = await query(`insert
   into messages
   (id,user,receiver,type,title,content,addins,sessionid,dateadded)
   values(?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP())`,
   [uid,messageInfo.sender.id,messageInfo.receiver,messageInfo.type,messageInfo.title,messageInfo.content,JSON.stringify(messageInfo.extra),sid])
  if (insert) {
    return uid;
  }else{
    return null
  }
}
export const getMessages = async(req,res) =>{
  try {
    let { token } = req.body
    token = authenticateToken(token);
    if (!token.success) return res.status(500).send(errorMessage.is_error)
    let user = token.token.id
    let q = await query(`select
    COALESCE(
      GROUP_CONCAT(
        JSON_OBJECT(
            'name', COALESCE(users.Full_name,patients.Full_name),
            'id', COALESCE(users.id,patients.id)
        )
      )
    , 'N/A') AS sender,
    messages.id,	
    messages.type,	
    messages.title,	
    messages.content,	
    messages.addins,
    messages.status,	
    messages.dateadded
    FROM
    messages
    LEFT JOIN users ON messages.user = users.id
    LEFT JOIN patients ON messages.user = patients.id
    where receiver = ? GROUP BY messages.id order by messages.dateadded desc`,[user])
    if (!q) return res.status(500).send(errorMessage.is_error)
    if (!q.length) return res.send({success:true, message: q})
    for (const message of q) {
      q[q.indexOf(message)].sender = JSON.parse(message.sender);
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
    let q = await query(`UPDATE messages SET status = ? where receiver = ? and id = ?`,['seen',user,message])
    if (!q) return res.status(500).send(errorMessage.is_error)
    res.send({success:true, message: errorMessage.me_message})
    let mssg = await getMessage(message)
    if (mssg) {
      mssg = mssg[0]
      let session = mssg.sessionid
      q = await query(`UPDATE messages SET status = ? where sessionid = ? AND id != ?`,['expired',session, message])
      let ids = await query(`select id,receiver from messages where sessionid = ? AND id != ? group by receiver`,[session, message])
      for (const id of ids) {
        if (id.receiver == user) {
          
          console.log(id)
        }
        const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === id.receiver)
        if (recipientSocket) {
            recipientSocket.emit('expiratemssg',id.id)
        }else{
            console.log('recepient is not online')
        }
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorMessage.is_error)
  }
}
