import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
export const addAppointment = async (req,res)=>{
    try {
        let { hc_provider,subject,message,time,token } = req.body
        token = authenticateToken(token)
        token = token.token.id
        let insert = await query(`insert into appointments(id,patient,hc_provider,subject,message,time)values(?,?,?,?,?,?)`,[id(), token,hc_provider,subject,message,time])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.ab_message})
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
        let select = await query(`Select users.Full_name as hc_provider, appointments.subject, hospitals.name as hospital, appointments.message,appointments.time,appointments.dateadded as date_booked from appointments Inner join users inner join hospitals on JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$') where appointments.patient = ? order by appointments.dateadded desc`,[token])
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
        let select = await query(`Select patients.Full_name as p_name, appointments.subject, appointments.message,appointments.time,appointments.dateadded as date_booked from appointments Inner join patients  where appointments.hc_provider = ? order by appointments.dateadded desc`,[token])
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
        users.Full_name AS hc_provider,
        patients.Full_name AS patient,
        appointments.subject,
        hospitals.name AS hospital,
        appointments.message,
        appointments.time,
        appointments.dateadded AS date_booked
    FROM
    appointments
    INNER JOIN users ON appointments.hc_provider = users.id
    INNER JOIN patients ON appointments.patient = patients.id
    INNER JOIN hospitals ON JSON_CONTAINS(hospitals.employees, JSON_QUOTE(users.id), '$')
    WHERE
        appointments.id = ?`,[id])
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
 