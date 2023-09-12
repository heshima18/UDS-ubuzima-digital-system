import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
export const addAssurance = async (req,res)=>{
    try {
        let { name,percentage } = req.body
        let insert = await query(`insert into assurances(id,name,percentage_coverage)values(?,?,?)`,[id(), name, percentage])
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
        let select = await query(`SELECT
         assurances.id,
         assurances.name,
         COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN users.id IS NOT NULL THEN JSON_OBJECT('id', users.id, 'name', users.Full_name) ELSE NULL END), ']'), '[]') AS managers,
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
            res.status(500).send({success:false, message: errorMessage.is_error})
            return
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
