import { getCustomHps } from "../controllers/hospital.controller";
import query from "../controllers/query.controller";
import addToken from "../controllers/token.signer.controller";
import authenticateToken from "../controllers/token.verifier.controller";
import server from "./holder.socket"
export const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  io.on('connection',(socket) =>{
      const clientTid = socket.handshake.query.id;
      query(`update users set online = ? where id = ?`,[true,clientTid])
      console.log('a client with id ',clientTid,'connected to the system')
      socket.emit('clientId',clientTid)
      socket.on('disconnect',()=>{
          query(`update users set online = ?, last_seen = current_timestamp() where id = ?`,[false,clientTid])
          console.log('client disconnected with id', clientTid)
      })
      socket.on('getpsforselection',async (hps)=>{
        socket.emit('selecthp', await getCustomHps(hps))
      })
      socket.on('messageToId',(data) =>{
          const { recipientId,message } = data;
          console.log('received Message For client ',recipientId, 'with message', message)
          const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === recipientId)
          if (recipientSocket) {
              recipientSocket.emit('message-for-id',`you've received a message from ${clientTid} with message ${message}`)
          }else{
              console.log('recepient not found')
          }
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
  })
  