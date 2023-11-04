import authenticateToken from "./token.verifier.controller";
import { DateTime } from "luxon";
import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import { io } from '../socket.io/connector.socket.io';
import { getSession } from "./credentials.verifier.controller";
import { selectPatient } from "./patients.controller";
import { ioSendMessage, ioSendMessages } from "./message.controller";
import { getHpEmployeesByDepartment } from "./employee.controller";
export const createTransfer = async (req,res)=>{
    try {
        const uid = id();
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        now = now.toFormat('yyyy-MM-dd HH:mm:ss')
        let {session,reason,facility,token,patient} = req.body,sessiondata
        sessiondata = await getSession(session)
        if (!sessiondata) {
            return res.status(500).send({success:false, message: errorMessage.is_error}) 
        }
        if (!sessiondata.length) {
            return res.status(404).send({success:false, message: errorMessage._err_sess_404})   
        }
        sessiondata = sessiondata[0]
        if (sessiondata.status != 'open') {
            return res.status(403).send({success:false, message: errorMessage.err_unopen_session})
        }
        let decoded = authenticateToken(token)
        decoded = decoded.token
        let user = decoded.id
        let insert = await query(`insert
         into transfers
         (id,session,from_facility,to_facility,patient,hc_provider,reason,date)
         values(?,?,?,?,?,?,?,?)`,
         [uid,session,sessiondata.hospital,facility,patient,user,reason,now])
        if (!insert) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        let up_session = await query('update medical_history set status = ? where id = ?',['transferred',session])
        if (up_session) {
            let getP = await selectPatient(patient),transfer = uid;
            let extra =  {
              transfer,
            }
            let content,title,sender,type
            content = `${getP.Full_name}'s session was transferred successfully`;
            title = `session transferred successfully !`
            sender = {name: 'system',id: '196371492058'}
            type = `transfer_message`
            let messageInfo = {type,content,title,sender,receiver: user,extra}
            let mssg_id = await ioSendMessage(messageInfo)
            if (mssg_id) {
              const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === user)
              Object.assign(messageInfo,{id: mssg_id})
              if (recipientSocket) {
                  recipientSocket.emit('message',messageInfo)
              }
            }
            let receivers =await getHpEmployeesByDepartment(facility,1261546939)
            receivers = receivers.map(function (recs) {
                return recs.id
            })
            title = `incoming transfer`
            content = `incoming transfer from ${decoded.hp_name}`
            messageInfo = {type,content,title,sender,receivers,extra}
            ioSendMessages(messageInfo)
        }
        res.send({success: true, message: errorMessage.transc_message})

      
    } catch (error) {
        console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
  }
  export const viewTransfer = async (req,res)=>{
    try { 
      let {session} = req.params
      let {token,transfer} = req.body
      token = authenticateToken(token)
      token = token.token
      const user = token.role
      let response = await query(`SELECT 
      tr.id AS tr_id,
      tr.session as session,
      tr.date as date,
      tr.reason as reason,
      GROUP_CONCAT(
        DISTINCT 
        JSON_OBJECT('id', p.id, 'name', p.Full_name,'bgroup', p.b_group, 'dob', p.dob,'phone', p.phone,'nid', p.nid, 'location', 
          CONCAT(
            (SELECT name From provinces Where id = p.resident_province),' , ',
            (SELECT name From districts Where id = p.resident_district),' , ',
            (SELECT name From sectors Where id = p.resident_sector),' , ',
            (SELECT name From cells Where id = p.resident_cell)
          )
        )
      ) AS p_info,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name, 'title', users.title, 'license', users.license,'phone', users.phone)) AS hcp_info,
      GROUP_CONCAT(
        DISTINCT
          JSON_OBJECT('id', tr.from_facility,'phone', hospitals.phone, 'name', hospitals.name, 'location', 
            CONCAT(
              (SELECT name From provinces Where id = hospitals.province),' , ',
              (SELECT name From districts Where id = hospitals.district),' , ',
              (SELECT name From sectors Where id = hospitals.sector),' , ',
              (SELECT name From cells Where id = hospitals.cell)
            )
        )
      ) AS hp_info,
      GROUP_CONCAT(
        DISTINCT
          JSON_OBJECT('id', tr.to_facility,'phone', hospitals2.phone, 'name', hospitals2.name, 'location', 
            CONCAT(
              (SELECT name From provinces Where id = hospitals2.province),' , ',
              (SELECT name From districts Where id = hospitals2.district),' , ',
              (SELECT name From sectors Where id = hospitals2.sector),' , ',
              (SELECT name From cells Where id = hospitals2.cell)
            )
        )
      ) AS hp_receiving_info
  FROM
      transfers tr
      INNER JOIN patients p ON tr.patient = p.id
      INNER JOIN users ON tr.hc_provider = users.id
      INNER JOIN hospitals as hospitals ON tr.from_facility = hospitals.id
      INNER JOIN hospitals as hospitals2 ON tr.to_facility = hospitals2.id
  WHERE tr.id = ? OR tr.session = ?
  GROUP BY tr.id;
  
    `,[transfer,transfer])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_trans_404})
      response = response[0]
      response.p_info = JSON.parse(response.p_info);
      response.hp_info = JSON.parse(response.hp_info);
      response.hp_receiving_info = JSON.parse(response.hp_receiving_info);
      response.hcp_info = JSON.parse(response.hcp_info);
      response.date  = DateTime.fromISO(response.date).toFormat('yyyy-MM-dd')
      res.send({success: true, message: response})
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
  }