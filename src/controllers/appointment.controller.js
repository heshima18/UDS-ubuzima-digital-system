import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
export const addAppointment = async (req,res)=>{
    try {
        let { patient,subject,message,time,token,dateadded,status,extra } = req.body
        if (!time) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        token = authenticateToken(token)
        let hc_provider = token.token.id
        if (extra) {
            extra = JSON.stringify(extra)
        }else{
            extra = null
        }
        let insert = await query(`insert
         into appointments
         (
            id,
            patient,
            hc_provider,
            subject,
            message,
            time,
            dateadded,
            status,
            extra
         )
         values
         (?,?,?,?,?,?,?,?,?)`,
         [id(), patient,hc_provider,subject,message,time,dateadded,status, extra])
        if (!insert) {
            res.status(500).send({success: false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: (status == 'declined')? errorMessage.appoi_decli_message : errorMessage.ab_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const myAppointments = async (req,res)=>{
    try {
        let { token } = req.body
        token = authenticateToken(token)
        token = token.token.id
        let select = await query(`SELECT
            distinct appointments.id,
            appointments.subject, 
            hospitals.name as hospital,
            appointments.time,
            appointments.status,
            appointments.dateadded as date_booked
          FROM
            appointments
                Inner join users ON users.id = appointments.hc_provider
                inner join hospitals on JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
          WHERE appointments.patient = ?
          GROUP BY
           appointments.id
          ORDER BY
           appointments.dateadded desc `,[token])
        if (!select) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: select})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const hcpAppointments = async (req,res)=>{
    try {
        let { token } = req.body
        token = authenticateToken(token)
        token = token.token.id
        let select = await query(`Select
          distinct appointments.id,
          patients.Full_name as patient,
          hospitals.name as hospital,
          appointments.subject,
          appointments.message,
          appointments.time,
          appointments.status,
          appointments.dateadded as date_booked
        from
         appointments
            Inner join users ON users.id = appointments.hc_provider
            Inner join patients ON patients.id = appointments.patient
            inner join hospitals on JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
        where appointments.hc_provider = ?
        group by appointments.id order by appointments.dateadded desc`,[token])
        if (!select) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: select})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const appointment = async (req,res)=>{
    try {
        let { id } = req.params
        let select = await query(`SELECT
        distinct appointments.id,
        users.Full_name AS hc_provider,
        patients.Full_name AS patient,
        appointments.subject,
        hospitals.name AS hospital,
        appointments.message,
        appointments.time,
        appointments.extra,
        appointments.dateadded AS date_booked,
        appointments.status
        FROM
        appointments
        INNER JOIN users ON appointments.hc_provider = users.id
        INNER JOIN patients ON appointments.patient = patients.id
        INNER JOIN hospitals ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
        WHERE
        appointments.id = ? GROUP BY appointments.id`,[id])
        if (!select) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        if (!select.length) {
            return  res.status(404).send({success: false, message: errorMessage.err_appoi_404_message})
        }
        select = select[0]
        if (select.extra) {
            select.extra = JSON.parse(select.extra)
        }
        res.send({success: true, message: select})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const approveAppointment = async (req,res)=>{
    try {
        let { token,appointment } = req.body
        token = authenticateToken(token)
        token = token.token.id
        let update = await query(`update appointments set status = ? where id = ? && hc_provider = ? AND status != ? AND status != ?`,['approved', appointment,token,'declined','outdated'])
        if (!update) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }else if (update.affectedRows == 0) {
            res.status(401).send({success:false, message: errorMessage._err_forbidden})
            return
        }
        res.send({success: true, message: errorMessage.appoi_appr_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const declineAppointment = async (req,res)=>{
    try {
        let { token,appointment } = req.body
        token = authenticateToken(token)
        token = token.token.id
        let update = await query(`update appointments set status = ? where id = ? && hc_provider = ? AND status != ?`,['declined', appointment, token,'approved'])
        if (!update) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }else if (update.affectedRows == 0) {
            res.status(401).send({success:false, message: errorMessage._err_forbidden})
            return
        }
        res.send({success: true, message: errorMessage.appoi_decli_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}