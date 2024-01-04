import { MatchTemplate, connectFP } from './fingerprint.controller';
import query from './query.controller'
import errorMessage from './response.message.controller'
import authenticateToken from './token.verifier.controller';
import id from "./randomInt.generator.controller";
import EventEmitter from 'events';
import { io } from '../socket.io/connector.socket.io';
import addToken from './token.signer.controller';
import { checkEmail, checkObjectAvai, checkPhone, checku_name } from './credentials.verifier.controller';
class MyEventEmitter extends EventEmitter {}
const event = new MyEventEmitter();
export const getPatients = async (req,res)=>{
        try {
            let select = await query(`
                SELECT id,Full_name,phone,email,nid,status
                FROM patients
            `)
            if (!select) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            res.send({success: true, message: select})
        } catch (error) {
            console.log(error)
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
}
export const getPatient = async (req,res)=>{
    try {
        var {patient} = req.params
        let {fp_data,type} = req.body
        if (!patient && type == 'fp') {
            let patiFps = await selectPatientFP();
            if (!patiFps)  return res.status(500).send({success:false, message: errorMessage.is_error})
            let ogUser = await new Promise(async (resolve,reject) => {
                let foundPatient = null; // Initialize a variable to store the found patient
                for (const user of patiFps) {
                    // console.log(user)
                    let check
                    try {
                        check = await  connectFP('', (callback) => {
                          if (callback.type && callback.type == 'comparison' && callback.success) {
                            event.emit('responseReceived',user)
                          } else if (callback.type && callback.type == 'comparison' && !callback.success) {
                            event.emit('responseReceived',null)
                          }
                          if (callback.type == 'connection' && !callback.success) {
                            reject(0);
                          }
                        })
                        
                    } catch (error) {
                        console.log(error)
                        check = !1
                    }
                    if (check) {
                        MatchTemplate(fp_data, user.data);
                    }else{
                        reject(0)
                    }
                    foundPatient = await new Promise((resolve4)=>{
                    event.once('responseReceived', (userdata)=>{
                       resolve4(userdata)
                    })
                  })
                  if (foundPatient) {
                    return resolve(foundPatient); // Resolve with the found patient (may be null if not found)
                  }else{
                    if (patiFps.indexOf(user) + 1 == patiFps.length && !foundPatient) {
                        resolve(foundPatient);
                   }
                  }
                }
              });
              if (!ogUser) return res.status(404).send({success: false, message: errorMessage._err_u_404})
              patient = ogUser.user
        }
        let select = await query(`
            SELECT
                patients.id,
                COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CASE WHEN assurances.id IS NOT NULL THEN JSON_OBJECT('id', assurances.id, 'name', assurances.name) ELSE NULL END ), ']'), '[]') AS assurances,
                COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CASE WHEN p2.id IS NOT NULL THEN JSON_OBJECT('id', p2.id, 'name', p2.Full_name,'gender', p2.gender,'dob', DATE(p2.DOB),'NID', p2.nid) ELSE NULL END SEPARATOR ','), ']'), '[]') AS beneficiaries,
                COALESCE( GROUP_CONCAT(
                    DISTINCT CASE WHEN p3.id IS NOT NULL THEN JSON_OBJECT('id', p3.id, 'name', p3.Full_name, 'phone', p3.phone, 'NID', p3.nid) ELSE NULL END
                    ), null) AS householder,
                patients.Full_name,
                patients.assurances as raw_assurances,
                patients.phone,
                patients.email,
                patients.username,
                patients.gender,
                patients.nid,
                patients.dob,
                patients.role,
                provinces.name as province,
                districts.name as district,
                sectors.name as sector,
                cells.name as cell,
                patients.status
            FROM patients
                LEFT JOIN patients as p2 on p2.householder = patients.id
                LEFT JOIN patients as p3 on p3.id = patients.householder
                LEFT JOIN assurances on JSON_CONTAINS(patients.assurances, JSON_OBJECT('id',assurances.id), '$')
                INNER JOIN provinces on patients.resident_province = provinces.id
                INNER JOIN districts on patients.resident_district = districts.id
                INNER JOIN sectors on patients.resident_sector = sectors.id
                INNER JOIN cells on patients.resident_cell = cells.id
            where
                patients.nid = ? 
                OR patients.phone = ? 
                OR patients.email = ? 
                OR patients.id = ? 
                OR patients.username = ?
                OR JSON_CONTAINS(patients.assurances, JSON_OBJECT('number',?), '$')
            group by patients.id
        `,[patient,patient,patient,patient,patient,patient])
        if (!select) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_u_404})
        select = select[0]
        select.assurances = JSON.parse(select.assurances)
        if (select.householder) {
            select.householder = JSON.parse(select.householder)
        }
        select.beneficiaries = JSON.parse(select.beneficiaries)
        select.raw_assurances = JSON.parse(select.raw_assurances)
        for (const assurance of select.assurances) {
            for (const raw_assurance of select.raw_assurances) {
                if (raw_assurance.id == assurance.id) {
                    Object.assign(select.assurances[select.assurances.indexOf(assurance)],{eligibility: raw_assurance.status, number: raw_assurance.number})
                }
            }
        }
        delete select.raw_assurances
        res.send({success: true, message: select})
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false, message: errorMessage.is_error})
    }
}
export const addUserAssurance = async (req,res)=>{
    try {
      let {assurances,patient} = req.body
        let user = patient
        if (assurances.length == 0) {
            return res.status(404).send({success:false, message: errorMessage._err_assu_404})
        }
        for (const assurance of assurances) {
          var t = await query(`select name from assurances where id = ?`, [assurance.id]);
          if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
          if(t.length == 0) {
            return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          }else{
            let objectAvai =  await checkObjectAvai('patients','assurances','id',assurance.id,'id',user)
            if (!objectAvai) {
              return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            if (objectAvai.length) {
              return res.send({success: false, message: errorMessage.err_entr_avai})
            }
    
              let updateassurance = await query(`update patients set assurances =  JSON_ARRAY_APPEND(assurances, '$', JSON_OBJECT("id", ? ,"status", ?, "number", ?)) where id = ?`,[assurance.id,'eligible',assurance.number,user])
             if (!updateassurance) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
             }else if (updateassurance.affectedRows == 0){
                return res.status(500).send({success:false, message: errorMessage.is_error})
             }
          }
        }
        res.send({success: true, message: errorMessage.assu_added_to_user_message})
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
}
export const changeUserAssuranceStatus = async (req,res)=>{
    try {
      let {status,patient,token} = req.body,assurances
        let assurance = authenticateToken(token)
        assurance = assurance.token.assurance
        assurances = await selectPatient(patient)
        if (!assurances) {
            return res.status(404).send({success:false, message: errorMessage._err_p_404})
        }
        assurances = assurances.assurances
        assurances = assurances.map(assu=>{
            if (assu.id == assurance) {
                assu.status= status
            }
            return assu
        })
        let update = await query('update patients set assurances = ? where id = ?',[JSON.stringify(assurances),patient])
        if (update) {
            res.send({success: true, message: errorMessage.assu_st_chng})
        }else{
          res.status(500).send({success:false, message: errorMessage.is_error})
        }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
}
export async function selectPatient(patient) {
    try {
        let p = await query('select id, Full_name,password, email,assurances, phone,resident_province as province,resident_district as district,resident_sector as sector,resident_cell as cell,FA from patients where id = ?',[patient])
        if (!p) {
            return null
        }else{
            p  = p[0]
            p.assurances = JSON.parse(p.assurances)
            return p
        }
        
    } catch (error) {
        console.log(error)
        return null
    }
}
export async function selectPatientFP(patient) {
    try {
        let p
        if(patient){
            p = await query('select data, user from fingerprints where user = ? order by dateadded desc',[patient])
            if (!p) {
                return null
            }else{
                p  = p[0]
                return p
            }

        }else{
            p = await query('select data, user from fingerprints',[])
            if (!p) {
                return null
            }else{
                return p
            }
        }
        
    } catch (error) {
        console.log(error)
        return null
    }
}
export const addPatientFP = async (req,res)=>{
    try {
      let {fp_data,patient} = req.body
      if(patient){
            let p = await query(`insert into fingerprints (id,user,data) values(?,?,?)`,[id(),patient,fp_data])
            if (!p) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
        }
        res.send({success: true, message: errorMessage.FP_added_to_user_message})
      
    } catch (error) {
      console.log(error)
      res.status(500).send({success:false, message: errorMessage.is_error})
    }
}

export const addPatiBg = async (req,res) => {
    try {
        let {b_group,patient} = req.body
        var t = await query(`update patients set b_group = ? where id = ?`, [b_group,patient]); 
        if (!t) {
          return res.status(500).send({success:false, message: errorMessage.is_error})  
        }
        res.send({success: true, message: errorMessage.bg_added_to_user_message})
        
      } catch (error) {
        console.log(error)
        res.status(500).send({success:false, message: errorMessage.is_error})
      }
}
export const editPatientProfile = async (req,res)=>{
    try {
        let {type, password, value, token} = req.body
        let decoded = authenticateToken(token)
        decoded = decoded.token
        var patient =  decoded.id;
        patient = await selectPatient(patient)

        if (patient) {
          if (type!='password') {
            if (patient.password !== password) {
             return res.send({success: false, message: errorMessage._err_forbidden})
            }
            if (type == 'email') {
              let des = await checkEmail(value,'patients')
              if(!des) return res.status(500).send({success: false, message : errorMessage.is_error});
              if (des.length) return res.send({success: false, message : errorMessage._err_email_avai});
            }else if(type == 'phone'){
              let des4 = await checkPhone(value,'patients')
              if(!des4) return res.status(500).send({success: false, message : errorMessage.is_error});
              if (des4.length) return res.send({success: false, message : errorMessage._err_phone_avai});
            }else if (type == 'patientname') {
              let des3 = await checku_name(value,'patients')
              if(!des3) return res.status(500).send({success: false, message : errorMessage.is_error});
              if (des3.length) return res.send({success: false, message : errorMessage._err_uname_avai});
            }
          }
          let update = await query(`UPDATE patients set ${type} = ? where id = ?`,[value,patient.id])
          if (!update) {
            return res.send({success: false, message: errorMessage.is_error})
          }
          if (type != 'password') {   
            const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === patient.id)
            if (recipientSocket) {
              decoded[type] = value
              decoded = addToken(decoded)
              recipientSocket.emit('changetoken',decoded)
            }else{
                console.log('recepient is not online')
            }
          }
          return res.send({success: true, message: errorMessage.profile_updated})
          
        }else{
            res.send({success: false, message: errorMessage._err_p_404})
        }
  
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
  }
