import query from './query.controller'
import errorMessage from './response.message.controller'
import authenticateToken from './token.verifier.controller';
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
        let {patient} = req.params
        let select = await query(`
            SELECT
             patients.id,
             COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"id": "', assurances.id, '","name": "', assurances.name, '"}')), ']'), '[]') AS assurances,
             patients.Full_name,
             patients.assurances as raw_assurances,
             patients.phone,
             patients.email,
             patients.nid,
             provinces.name as province,
             districts.name as disrtict,
             sectors.name as sector,
             cells.name as cell,
             patients.status
            FROM patients
             LEFT join assurances on JSON_CONTAINS(patients.assurances, JSON_OBJECT('id',assurances.id), '$')
             LEFT JOIN provinces on patients.resident_province = provinces.id
             LEFT JOIN districts on patients.resident_district = districts.id
             LEFT JOIN sectors on patients.resident_sector = sectors.id
             LEFT JOIN cells on patients.resident_cell = cells.id
            where patients.id = ?
            group by patients.id
        `,[patient])
        if (!select) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_u_404})
        select = select[0]
        select.assurances = JSON.parse(select.assurances)
        select.raw_assurances = JSON.parse(select.raw_assurances)
        for (const assurance of select.assurances) {
            for (const raw_assurance of select.raw_assurances) {
                if (raw_assurance.id == assurance.id) {
                    Object.assign(select.assurances[select.assurances.indexOf(assurance)],{eligibility: raw_assurance.status})
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
export const searchPatient = async (req,res)=>{
    try {
        let {patient} = req.body
        let select = await query(`
            SELECT
             patients.id,
             COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"id": "', assurances.id, '","name": "', assurances.name, '"}')), ']'), '[]') AS assurances,
             patients.Full_name,
             patients.assurances as raw_assurances,
             patients.phone,
             patients.email,
             patients.nid,
             provinces.name as province,
             districts.name as disrtict,
             sectors.name as sector,
             cells.name as cell,
             patients.status
            FROM patients
             LEFT JOIN assurances on JSON_CONTAINS(patients.assurances, JSON_OBJECT('id',assurances.id), '$')
             INNER JOIN provinces on patients.resident_province = provinces.id
             INNER JOIN districts on patients.resident_district = districts.id
             INNER JOIN sectors on patients.resident_sector = sectors.id
             INNER JOIN cells on patients.resident_cell = cells.id
            where patients.id = ? OR patients.nid = ? OR patients.phone = ? OR patients.email = ?
            group by patients.id
        `,[patient,patient,patient,patient])
        if (!select) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (select.length == 0) return res.status(404).send({success: false, message: errorMessage._err_u_404})
        select = select[0]
        select.assurances = JSON.parse(select.assurances)
        select.raw_assurances = JSON.parse(select.raw_assurances)
        for (const assurance of select.assurances) {
            for (const raw_assurance of select.raw_assurances) {
                if (raw_assurance.id == assurance.id) {
                    Object.assign(select.assurances[select.assurances.indexOf(assurance)],{eligibility: raw_assurance.status})
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
              let updateassurance = await query(`update patients set assurances =  JSON_ARRAY_APPEND(assurances, '$', JSON_OBJECT("id", ? ,"status", ?)) where id = ?`,[assurance,'eligible',user])
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
