
import  authenticateToken  from '../controllers/token.verifier.controller'
import query from "../controllers/query.controller";
import errorMessage from '../controllers/response.message.controller';
import generate2FAcode from '../controllers/2FA.code.generator.controller';
import { ioSendMessage } from '../controllers/message.controller';
import { io } from '../socket.io/connector.socket.io';
import { selectPatient, selectPatientFP } from '../controllers/patients.controller';
import { MatchTemplate,connectFP } from '../controllers/fingerprint.controller';
import { getRelatives } from '../controllers/credentials.verifier.controller';
export const  addPati2fa = async (req,res,next,mess) =>{
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
        content = (mess)?mess.content : `some one tried to access your information share the requester with this code: ${code} to authorize the access`;
        title = (mess)? mess.title : `information access request`
        sender = {name: 'system',id: '196371492058'}
        type = `info_access_req`
        let messageInfo = {type,content,title,sender,receiver: userid,extra}
        let mssg_id = await ioSendMessage(messageInfo),ReqSocket,ui
        ui = setTimeout(e=>{
            if (!req.headersSent) {
                res.status(408).send({success: false,message: errorMessage._err_timeout})
            }
        },60000)
        if (mssg_id) {
            const recipientSocket = Array.from(io.sockets.sockets.values()).filter((sock) => {return sock.handshake.query.id == userid ||  sock.handshake.query.id == id})
            Object.assign(messageInfo,{id: mssg_id})
            recipientSocket.forEach(socket=>{
                if (socket.handshake.query.id == userid) {
                    socket.emit('message',messageInfo)
                }else if (socket.handshake.query.id == id) {
                    socket.emit('patiAuth',userid)
                    ReqSocket = socket

                }
            })
            if (ReqSocket) {
                const dec = await new Promise((resolve, reject) => {
                    ReqSocket.on('authCode', async (code)=>{
                        if (code.type == 'code') {
                            try {
                                let p = await selectPatient(userid)
                                if (!p) resolve(0);
                                if (p.FA != code.v) {
                                    resolve(0);
                                    clearTimeout(ui)
                                }else if(p.FA == code.v){
                                    resolve(1);
                                    clearTimeout(ui)
                                }
                            } catch (error) {
                                console.log(error)
                                resolve(0)
                                clearTimeout(ui)
                            }
                            
                        }else if (code.type == 'fp') {
                           let fp_data = code.fp_data
                           let p = await selectPatientFP(userid)
                           if (!p) return reject(0);
                           clearTimeout(ui)
                           let connection
                           try {
                               connection = await connectFP('',callback=>{
                                    if (callback.type && callback.type == 'comparison' && callback.success) {
                                        resolve(1)
                                        clearTimeout(ui)
                                        ReqSocket.emit('RemoveAuthDivs',true)
    
                                    }else if (callback.type && callback.type == 'comparison' && !callback.success) {
                                        ReqSocket.emit('messagefromserver','incorrect fingerprint try again')
                                        // resolve(0)
                                    }
                                    
                               })
                            
                           } catch (error) {
                            connection = !1
                           }
                           if (connection) {
                               MatchTemplate(fp_data,p.data)
                           }else{
                               reject(0)
                               clearTimeout(ui)
                           }
                        }
                    })
                  });
                  if (!dec) {clearTimeout(ui);return res.status(401).send({ message: errorMessage._err_forbidden, success: false });}
                  ReqSocket.emit('RemoveAuthDivs',null)
                next()    
            }
        }else{
            throw mssg_id
        }
      } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
      }
}
export const  addPatiNextOfKin2fa = async (req,res,next) =>{
    try {
        const {token} = req.body;
        const {userid} = req.params;
        const decoded = authenticateToken(token);
        if (!decoded.success) return res.status(500).send({ message: errorMessage.is_error, success: false });
        let {role,id} = decoded.token
        let content,title,sender,type,extra = {},code = generate2FAcode(),relatives = await getRelatives(userid)
        if (!relatives || !relatives.length) {
            return res.status(404).send({success: false, message: errorMessage._err_rel_404})
        }
        for (const relative of relatives) {
            let updateResult = await query(`UPDATE patients SET FA = ? WHERE id = ?`, [code, userid])
            if (!updateResult) {
            res.status(500).send({ message: errorMessage.is_error, success: false });
            return 
            }
            content = `some one tried to access your information share the requester with this code: ${code} to authorize the access`;
            title = `information access request`
            sender = {name: 'system',id: '196371492058'}
            type = `info_access_req`
            let messageInfo = {type,content,title,sender,receiver: userid,extra}
            let mssg_id = await ioSendMessage(messageInfo)
            Object.assign(messageInfo,{id: mssg_id})
            const recipientPatientSocket = Array.from(io.sockets.sockets.values()).find((sock) => {return sock.handshake.query.id == relative})
            if (recipientPatientSocket) {
                recipientPatientSocket.emit('message',messageInfo)
            }
        }
        let ui = setTimeout(e=>{
            if (!req.headersSent) {
                res.status(408).send({success: false,message: errorMessage._err_timeout})
            }
        },60000),ReqSocket
        if (1) {
            const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => {return sock.handshake.query.id == id})
            recipientSocket.emit('patiAuth',{title: `patient's relatives confirmation`,content: `enter any of the auth codes we sent to the patient's relatives`})
            ReqSocket = recipientSocket

            if (ReqSocket) {
                const dec = await new Promise((resolve, reject) => {
                    ReqSocket.on('authCode', async (code)=>{
                        
                        if (code.type == 'code') {
                            try {
                                for (const relative of relatives) {
                                    let p = await selectPatient(relative)
                                    if (!p) resolve(0);
                                    if (p.FA != code.v && relatives.indexOf(relative) == (relatives.length - 1)) {
                                        resolve(0);
                                        clearTimeout(ui)
                                    }else if(p.FA == code.v){
                                        resolve(1);
                                        clearTimeout(ui)
                                    }
                                    
                                }
                            } catch (error) {
                                console.log(error)
                                resolve(0)
                                clearTimeout(ui)
                            }
                            
                            
                        }else if (code.type == 'fp') {
                           let fp_data = code.fp_data
                           for (const relative of relatives) {
                               let p = await selectPatientFP(relative)
                               if (!p) p = {user: relative, data: 'n/a'}
                               let connection
                               try {
                                   connection = await connectFP('',callback=>{
                                        if (callback.type && callback.type == 'comparison' && callback.success) {
                                            console.log(relative)
                                            resolve(1)
                                            clearTimeout(ui)
                                            ReqSocket.emit('RemoveAuthDivs',true)
        
                                        }else if (callback.type && callback.type == 'comparison' && !callback.success && relatives.indexOf(relative) == (relatives.length - 1)) {
                                            ReqSocket.emit('messagefromserver',`relative's fingerprint not recognised  try again`)
                                            resolve(0)
                                            clearTimeout(ui)
                                        }
                                        
                                   })
                                
                               } catch (error) {
                                connection = !1
                               }
                               if (connection) {
                                   MatchTemplate(fp_data,p.data)
                               }else{
                                   reject(0)
                                   clearTimeout(ui)
                               }
                            
                           }
                        }
                    })
                  });
                if (!dec) {
                    clearTimeout(ui)
                    recipientSocket.emit('RemoveAuthDivs',null)
                    return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
                }
                recipientSocket.emit('RemoveAuthDivs',null)
                next()    
            }
        }
      } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
      }
}