
import  authenticateToken  from '../controllers/token.verifier.controller'
import query from "../controllers/query.controller";
import errorMessage from '../controllers/response.message.controller';
import generate2FAcode from '../controllers/2FA.code.generator.controller';
import { ioSendMessage } from '../controllers/message.controller';
import { io } from '../socket.io/connector.socket.io';
import { selectPatient } from '../controllers/patients.controller';
export const  addPati2fa = async (req,res,next) =>{
    try {
        const {token} = req.body;
        const {userid} = req.params;
        const decoded = authenticateToken(token);
        if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });
        let {role,id} = decoded.token
        if (role == 'patient' || role == 'householder') return next()
        let content,title,sender,type,extra = {},code = generate2FAcode() 
        let updateResult = await query(`UPDATE patients SET FA = ? WHERE id = ?`, [code, userid])
        if (!updateResult) {
        res.status(500).send({ message: errorMessage.is_error, success: false });
        return 
        }
        content = `some one tried to access your information share the requester with this code ${code} to authorize the access`;
        title = `information access request`
        sender = {name: 'system',id: '196371492058'}
        type = `info_access_req`
        let messageInfo = {type,content,title,sender,receiver: userid,extra}
        let mssg_id = await ioSendMessage(messageInfo),ReqSocket
        if (mssg_id) {
            const recipientSocket = Array.from(io.sockets.sockets.values()).filter((sock) => {return sock.handshake.query.id == userid ||  sock.handshake.query.id == id})
            Object.assign(messageInfo,{id: mssg_id})
            recipientSocket.forEach(socket=>{
                if (socket.handshake.query.id == userid) {
                    socket.emit('message',messageInfo)
                }else if (socket.handshake.query.id == id) {
                    socket.emit('accessAuth',userid)
                    ReqSocket = socket

                }
            })
            if (ReqSocket) {
                const dec = await new Promise((resolve, reject) => {
                    ReqSocket.on('authCode', async (code)=>{
                        let p = await selectPatient(code.user)
                        if (!p) resolve(0);
                        if (p.FA != code.v) {
                            resolve(0);
                        }
                        resolve(1);
                    })
                  });
                if (!dec) return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
                next()    
            }
        }
      } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
      }
}