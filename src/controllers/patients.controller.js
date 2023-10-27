import { MatchTemplate, connectFP } from './fingerprint.controller';
import query from './query.controller'
import errorMessage from './response.message.controller'
import authenticateToken from './token.verifier.controller';
import EventEmitter from 'events';
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
                    event.on('responseReceived', (userdata)=>{
                       resolve4(userdata)
                    })
                  })
                  if (foundPatient) {
                    return resolve(foundPatient); // Resolve with the found patient (may be null if not found)
                  }else{
                    resolve(foundPatient);
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
                COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CASE WHEN p2.id IS NOT NULL THEN JSON_OBJECT('id', p2.id, 'name', p2.Full_name) ELSE NULL END SEPARATOR ','), ']'), '[]') AS beneficiaries,
                patients.Full_name,
                patients.assurances as raw_assurances,
                patients.phone,
                patients.email,
                patients.gender,
                patients.nid,
                patients.dob,
                provinces.name as province,
                districts.name as district,
                sectors.name as sector,
                cells.name as cell,
                patients.status
            FROM patients
                LEFT JOIN patients as p2 on p2.householder = patients.id
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
      let {assurances,token} = req.body
        let decoded = authenticateToken(token)
        let user = decoded.token.id
        if (assurances.length == 0) {
            return res.status(404).send({success:false, message: errorMessage._err_assu_404})
        }
        for (const assurance of assurances) {
          var t = await query(`select name from assurances where id = ?`, [assurance]);
          if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
          if(t.length == 0) {
            return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          }else{
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
export async function selectPatient(patient) {
    try {
        let p = await query('select id, Full_name, email, phone, FA from patients where id = ?',[patient])
        if (!p) {
            return null
        }else{
            p  = p[0]
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
            p = await query('select data, user from fingerprints where user = ?',[patient])
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
