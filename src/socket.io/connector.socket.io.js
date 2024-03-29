import { getCustomHps } from "../controllers/hospital.controller";
import query from "../controllers/query.controller";
import addToken from "../controllers/token.signer.controller";
import authenticateToken from "../controllers/token.verifier.controller";
import server from "./holder.socket"
import { findRecs } from "./recs.socket";
export const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  io.on('connection',(socket) =>{
      const clientTid = socket.handshake.query.id;
      query(`update users set online = ? where id = ?`,[true,clientTid])
      socket.on('disconnect',()=>{
          query(`update users set online = ?, last_seen = current_timestamp() where id = ?`,[false,clientTid])
      })
      socket.on('messageToId',async (data)=>{
        const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === data.recipientId)
         if (recipientSocket) {
          if (data.type == 'reqCinfo') {
            recipientSocket.emit('showCPinfo',{requester: clientTid,facility: data.facility})
            let Cinfo = await new Promise((resolve,reject)=>{
              recipientSocket.on('Cinfo', data=>{
                if (data.requester == clientTid) {
                  resolve(data.info)
                }
              })
            })
            socket.emit('CinfoRes',Cinfo)
          }
         }else{
             console.log('recepient is not online')
         }
      })
      socket.on('getpsforselection',async (hps)=>{
        socket.emit('selecthp', await getCustomHps(hps))
      })
      socket.on('hpchoosen',(data)=>{
        let {hp,token} = data
        token = authenticateToken(token)
        if (token.success) {
            try {
                token = token.token
                token.hospital = hp.id
                token.hp_name = hp.name
                token = addToken(token)
                socket.emit('changetoken',token)
            } catch (error) {
                
            }
            
        }
      })
      socket.on('searchForRecs',(data)=>{
        let {type,entity,needle,datatofetch,coltosearch} = data
        switch (entity) {
          case 'facility':
            entity = 'hospitals'
            break;
        
          default:
            entity = entity
            break;
        }
        findRecs(socket,entity,needle,type,datatofetch,coltosearch)
      })
  })
  