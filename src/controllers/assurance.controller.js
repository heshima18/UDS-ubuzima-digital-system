import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import { checkArrayAvai } from './credentials.verifier.controller';
import authenticateToken from './token.verifier.controller';
export const addAssurance = async (req,res)=>{
    try {
        let { name,percentage } = req.body
        let insert = await query(`insert into assurances(id,name,percentage_coverage,
            rstctd_medicines,	
            rstctd_tests,
            rstctd_operations,	
            rstctd_equipments,	
            rstctd_services,	
            managers,
            dateadded	
            )values(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP())`,[id(), name, percentage,'[]','[]','[]','[]','[]','[]'])
        if (!insert) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        res.send({success: true, message: errorMessage.assu_added_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const getAssurances = async (req,res)=>{
    try {
        let select = await query(`SELECT
         assurances.id,
         assurances.name,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN users.id IS NOT NULL THEN JSON_OBJECT('id', users.id, 'name', users.Full_name) ELSE NULL END), ']'), '[]') AS managers
        FROM
         assurances
         LEFT JOIN users ON JSON_CONTAINS(assurances.managers, JSON_QUOTE(users.id), '$')
        group by assurances.id
         `)
        
        if (!select) {
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
        }
        select = select.map(function (assurance) {
            assurance.managers = JSON.parse(assurance.managers) 
            return assurance
        })
        res.send({success: true, message: select})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const assurance = async (req,res)=>{
    try {
        let {assurance} = req.params
        if (!assurance) {
            let { token } = req.body
            token = authenticateToken(token)
            token = token.token
            assurance = token.assurance
        }
        if (!assurance) {
            return res.status(404).send({success: false, message: errorMessage._err_assu_404})
        }
        let select = await query(`SELECT
         assurances.id,
         assurances.name,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN users.id IS NOT NULL THEN JSON_OBJECT('id', users.id, 'name', users.Full_name, 'title', users.title) ELSE NULL END), ']'), '[]') AS managers,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN medicines.id IS NOT NULL THEN JSON_OBJECT('id', medicines.id, 'name', medicines.name, 'price', medicines.price) ELSE NULL END), ']'), '[]') AS rstrct_m,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN tests.id IS NOT NULL THEN JSON_OBJECT('id', tests.id, 'name', tests.name, 'price', tests.price) ELSE NULL END), ']'), '[]') AS rstrct_t,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN operations.id IS NOT NULL THEN JSON_OBJECT('id', operations.id, 'name', operations.name, 'price', operations.price) ELSE NULL END), ']'), '[]') AS rstrct_o,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN services.id IS NOT NULL THEN JSON_OBJECT('id', services.id, 'name', services.name, 'price', services.price) ELSE NULL END), ']'), '[]') AS rstrct_s,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN equipments.id IS NOT NULL THEN JSON_OBJECT('id', equipments.id, 'name', equipments.name, 'price', equipments.price) ELSE NULL END), ']'), '[]') AS rstrct_e
        FROM
         assurances
         LEFT JOIN users ON JSON_CONTAINS(assurances.managers, JSON_QUOTE(users.id), '$')
         LEFT JOIN medicines ON JSON_CONTAINS(assurances.rstctd_medicines, JSON_QUOTE(medicines.id), '$')
         LEFT JOIN tests ON JSON_CONTAINS(assurances.rstctd_tests, JSON_QUOTE(tests.id), '$')
         LEFT JOIN operations ON JSON_CONTAINS(assurances.rstctd_operations, JSON_QUOTE(operations.id), '$')
         LEFT JOIN equipments ON JSON_CONTAINS(assurances.rstctd_equipments, JSON_QUOTE(equipments.id), '$')
         LEFT JOIN services ON JSON_CONTAINS(assurances.rstctd_services, JSON_QUOTE(services.id), '$')

        WHERE 
         assurances.id = ?
        group by assurances.id
         `,[assurance])
        
        if (!select) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (assurance.length == 0) return res.status(404).send({success: false, message: select})
        select = select.map(function (assurance) {
            assurance.managers = JSON.parse(assurance.managers)
            assurance.rstrct_m = JSON.parse(assurance.rstrct_m)
            assurance.rstrct_s = JSON.parse(assurance.rstrct_s)
            assurance.rstrct_o = JSON.parse(assurance.rstrct_o) 
            assurance.rstrct_t = JSON.parse(assurance.rstrct_t) 
            assurance.rstrct_e = JSON.parse(assurance.rstrct_e) 
            return assurance
        })
        res.send({success: true, message: select[0]})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addMedicineToAssuranceRestrictedList = async (req,res)=>{
    try {
        let {medicines, assurance} = req.body
        for (const medicine of medicines) {
            let ArrayAvai = await checkArrayAvai('assurances','rstctd_medicines',medicine.id,'id',assurance);
            if (!ArrayAvai) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            if (ArrayAvai.length) {
                return res.send({success: false, message: errorMessage.err_entr_avai})
            }
            let update = await query(`UPDATE assurances SET rstctd_medicines = JSON_ARRAY_APPEND(rstctd_medicines, '$', ?) where assurances.id = ?`,[medicine.id,assurance]);
            if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
            if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          
        }
        res.send({success: true, message: errorMessage.mc_added_to_aSsU_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addTestToAssuranceRestrictedList = async (req,res)=>{
    try {
        let {tests, assurance} = req.body
        for (const test of tests) {
            let ArrayAvai = await checkArrayAvai('assurances','rstctd_tests',test.id,'id',assurance);
            if (!ArrayAvai) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            if (ArrayAvai.length) {
                return res.send({success: false, message: errorMessage.err_entr_avai})
            }
            let update = await query(`UPDATE assurances SET rstctd_tests = JSON_ARRAY_APPEND(rstctd_tests, '$', ?) where assurances.id = ?`,[test.id,assurance]);
            if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
            if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          
        }
        res.send({success: true, message: errorMessage.tc_added_to_aSsU_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addEquipmentToAssuranceRestrictedList = async (req,res)=>{
    try {
        let {equipments, assurance} = req.body
        for (const equipment of equipments) {
            let ArrayAvai = await checkArrayAvai('assurances','rstctd_equipments',equipment.id,'id',assurance);
            if (!ArrayAvai) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            if (ArrayAvai.length) {
                return res.send({success: false, message: errorMessage.err_entr_avai})
            }
            let update = await query(`UPDATE assurances SET rstctd_equipments = JSON_ARRAY_APPEND(rstctd_equipments, '$', ?) where assurances.id = ?`,[equipment.id,assurance]);
            if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
            if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          
        }
        res.send({success: true, message: errorMessage.ec_added_to_aSsU_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addServiceToAssuranceRestrictedList = async (req,res)=>{
    try {
        let {services, assurance} = req.body
        for (const service of services) {
            let ArrayAvai = await checkArrayAvai('assurances','rstctd_services',service.id,'id',assurance);
            if (!ArrayAvai) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            if (ArrayAvai.length) {
                return res.send({success: false, message: errorMessage.err_entr_avai})
            }
            let update = await query(`UPDATE assurances SET rstctd_services = JSON_ARRAY_APPEND(rstctd_services, '$', ?) where assurances.id = ?`,[service.id,assurance]);
            if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
            if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          
        }
        res.send({success: true, message: errorMessage.sc_added_to_aSsU_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const addOperationToAssuranceRestrictedList = async (req,res)=>{
    try {
        let {operations, assurance} = req.body
        for (const operation of operations) {
            let ArrayAvai = await checkArrayAvai('assurances','rstctd_operations',operation.id,'id',assurance);
            if (!ArrayAvai) {
                return res.status(500).send({success:false, message: errorMessage.is_error})
            }
            if (ArrayAvai.length) {
                return res.send({success: false, message: errorMessage.err_entr_avai})
            }
            let update = await query(`UPDATE assurances SET rstctd_operations = JSON_ARRAY_APPEND(rstctd_operations, '$', ?) where assurances.id = ?`,[operation.id,assurance]);
            if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
            if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_assu_404})
          
        }
        res.send({success: true, message: errorMessage.oc_added_to_aSsU_message})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const removeItemFromAssurancelist = async (req,res)=>{
    try {
        let {type, assurance, needle} = req.body
        let ArrayAvai = await checkArrayAvai('assurances',type,needle,'id',assurance);
        if (!ArrayAvai) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (!ArrayAvai.length) {
            return res.send({success: false, message: errorMessage.err_entr_not_avai})
        }
        let update = await query(`UPDATE assurances SET ${type} = JSON_REMOVE(${type},JSON_UNQUOTE(JSON_SEARCH(${type}, 'one',?))) where assurances.id = ?`,[needle,assurance]);
        if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
        res.send({success: true, message: errorMessage.entr_removed})
    } catch (error) {
        res.status(500).send({success:false, message: errorMessage.is_error})
        console.log(error)
    }
}
export const assuranceHP = async (req,res) =>{
    try {
      let { token } = req.body
      token = authenticateToken(token)
      token = token.token
      let assurance = token.assurance
      let response = await query(`SELECT
                                    distinct hp.id,
                                    hp.name
                                  FROM
                                    medical_history as mh
                                    INNER JOIN 
                                      hospitals as hp on mh.hospital = hp.id
                                  WHERE
                                    mh.assurance = ?
                                  GROUP BY 
                                    hp.id
      `,[assurance])
      if (!response) return res.status(500).send({success: true, message: errorMessage.is_error})
      res.send({success: true, message: response})
    } catch (error) {
      console.log(error)
      return res.status(500).send({success: true, message: errorMessage.is_error})
    }
    
  }
export const addassuranceToHp = async (req,res)=>{
  try {
    let {assurance,hospital,token} = req.body
    if (!hospital) {
      let decoded = authenticateToken(token)
      decoded = decoded.token
      hospital = decoded.hospital
    }
      let ArrayAvai = await checkArrayAvai('hospitals','assurances',assurance,'id',hospital);
      if (!ArrayAvai) return res.status(500).send({success: false, message: errorMessage.is_error})
      if (ArrayAvai.length) {
        return res.send({success: false, message: errorMessage.err_entr_avai})
      }
      let update = await query(`UPDATE hospitals SET assurances = JSON_ARRAY_APPEND(assurances, '$', ?) where hospitals.id = ?`,[assurance,hospital]);
      if (!update) return res.status(500).send({success:false, message: errorMessage.is_error})
      if (!update.affectedRows) return res.status(404).send({success:false, message: errorMessage._err_hc_404})
      res.send({success: true, message: errorMessage.asuutohp_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getAssuBenefs = async (req,res)=>{
    let {token} = req.body
    let decoded = authenticateToken(token)
    decoded = decoded.token
    var assurance =  decoded.assurance;
    (!assurance)?  assurance = req.body.assurance: null;
    try {
        let select = await query(`
            SELECT
             patients.id,
             patients.Full_name,
             patients.phone,
             patients.email,
             patients.role,
             patients.assurances
            FROM 
             patients
            WHERE 
            JSON_CONTAINS(patients.assurances, JSON_OBJECT('id',?), '$')
             GROUP BY patients.id
        `,[assurance])
        if (!select) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        select = select.map(record =>{
            record.assurances = JSON.parse(record.assurances)
            record.assurances = record.assurances.find(assu =>{
                return assu.id == assurance
            })
            return record
        })
        res.send({success: true, message: select})
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false, message: errorMessage.is_error})
    }
  }