import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { calculatePayments } from '../utils/calculate.payments.controller';
export const addSession = async (req,res)=>{
  try {
    let {patient,symptoms,tests,decision,departments,medicines,comment,token,assurance,close,equipments,services,operations} = req.body
      let uid = id();
      tests = tests || []
      equipments = equipments || []
      services = services || []
      operations = operations || []
      departments = departments || []
      decision = decision || []
      let decoded = authenticateToken(token)
      medicines = medicines || []
      let hc_provider = decoded.token.id
      departments.push(decoded.token.department)
      let hp = decoded.token.hospital
      let itt,imt,iet,iot,ist
      itt = 0
      imt = 0
      iot = 0
      iet = 0
      ist = 0
      for (const test of tests) {
        var t = await query(`select price from tests where id = ?`, [test.id]);
        Object.assign(tests[tests.indexOf(test)],{tester: hc_provider})
        if(t.length == 0)  return res.status(500).send({success:false, message: errorMessage._err_test_404})
        console.log(tests)
        t = t[0]
        itt +=t.price
      }
      let meds = await query(`select medicines from inventories where hospital = ?`, [hp]);
      [meds] = meds
      meds = JSON.parse(meds.medicines)
      for (const medicine of medicines) {
        for (const medic of meds) {
          if (medic.id == medicine.id) {
            if (medic.quantity < parseInt(medicine.quantity)) {
              Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: true})
            }else{
              var m = await query(`select price from medicines where id = ?`, [medicine.id]);
              if(m.length == 0)  return res.status(500).send({success:false, message: errorMessage._err_med_404})
              m = m[0]
              imt +=(m.price * parseInt(medicine.quantity))
              Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: false})
              meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.quantity)
            }
          }
        }
       
      }
      for (const equipment of equipments) {
        var m = await query(`select price from equipments where id = ?`, [equipment.id]);
        if(m.length == 0)  return res.status(404).send({success:false, message: errorMessage._err_equipment_404})
        m = m[0]
        iet +=(m.price * parseInt(equipment.quantity))
      }
      for (const service of services) {
        var m = await query(`select price from services where id = ?`, [service.id]);
        if(m.length == 0)  return res.status(404).send({success:false, message: errorMessage._err_service_404})
        m = m[0]
        ist +=(m.price * parseInt(service.quantity))
      }
      for (const operation of operations) {
        Object.assign(operations[operations.indexOf(operation)],{operator: hc_provider})
        var m = await query(`select price from operations where id = ?`, [operation.id]);
        if(m.length == 0)  return res.status(404).send({success:false, message: errorMessage._err_operation_404})
        m = m[0]
        iot +=m.price
      }
      query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(meds),hp])
      let tt = itt+imt+iot+ist+iet;
      let pts = await calculatePayments(assurance,tt)
      let insertpayment = await query(`insert into payments(id,user,session,amount,assurance_amount,status)values(?,?,?,?,?,?)`,[id(),patient,uid,pts.patient_ammount,pts.assurance_ammount,'awaiting payment'])
      let insert = await query(`insert into
       medical_history(id,patient,hospital,departments,hc_provider,symptoms,tests,medicines,decision,comment,status,assurance,services,operations,equipments)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[uid,patient,hp,JSON.stringify(departments),hc_provider,JSON.stringify(symptoms),JSON.stringify(tests),JSON.stringify(medicines),JSON.stringify(decision),comment,(close)? "closed" :"open",assurance,JSON.stringify(services),JSON.stringify(operations),JSON.stringify(equipments)])
      query(`update patients set last_diagnosed = (SELECT date FROM medical_history where id = ?) where id = ?`,[uid,patient])
      if (!insert || !insertpayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.session_message, id: uid})
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getUsessions = async (req,res)=>{
  try { let {userid} = req.params
      let response = await query(`SELECT 
      mh.id AS session_id,
      mh.tests as raw_tests,
      mh.comment as comment,
      mh.status as status,
      mh.medicines as raw_medicines,
      payments.amount as payment_amount,
      payments.status as payment_status,
      mh.decision as decision,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', m.name, '"}')), ']') AS medicines,
      COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', t.name, '"}')), ']'), '[]') AS tests
    FROM
      medical_history mh
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
    WHERE mh.patient = ?
    GROUP BY
    mh.id;
    `,[userid])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const mh of response) {
        response[response.indexOf(mh)].medicines = JSON.parse(mh.medicines);
        response[response.indexOf(mh)].decision = JSON.parse(mh.decision);
        response[response.indexOf(mh)].tests = JSON.parse(mh.tests)
        response[response.indexOf(mh)].raw_tests = JSON.parse(mh.raw_tests);
        response[response.indexOf(mh)].raw_medicines = JSON.parse(mh.raw_medicines)    
        for (const medicine of mh.medicines) {
            Object.assign(response[response.indexOf(mh)].medicines[mh.medicines.indexOf(medicine)],{quantity: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].quantity, servedOut: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].servedOut})
        }
        for (const tests of mh.tests) {
          try {
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result,tester: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].tester})
          } catch (error) {
            
          }
        }
        delete response[response.indexOf(mh)].raw_tests
        delete response[response.indexOf(mh)].raw_medicines
      }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getHpsessions = async (req,res)=>{
  try { 
      let {token} = req.body
      let decoded = authenticateToken(token)
      let hp = decoded.token.hospital
      if (!hp) {hp = req.body.hospital}
      let response = await query(`SELECT 
      mh.id AS session_id,
      mh.tests as raw_tests,
      mh.comment as comment,
      mh.status as status,
      patients.Full_name as patient_name,
      patients.id as patient_id,
      mh.medicines as raw_medicines,
      payments.amount as payment_amount,
      payments.status as payment_status,
      mh.decision as decision,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', m.name, '"}')), ']') AS medicines,
      COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', t.name, '"}')), ']'), '[]') AS tests
    FROM
      medical_history mh
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN patients ON mh.patient = patients.id
      INNER JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
    WHERE mh.hospital = ?
    GROUP BY
    mh.id;
    `,[hp])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const mh of response) {
        response[response.indexOf(mh)].medicines = JSON.parse(mh.medicines);
        response[response.indexOf(mh)].decision = JSON.parse(mh.decision);
        response[response.indexOf(mh)].tests = JSON.parse(mh.tests)
        response[response.indexOf(mh)].raw_tests = JSON.parse(mh.raw_tests);
        response[response.indexOf(mh)].raw_medicines = JSON.parse(mh.raw_medicines)    
        for (const medicine of mh.medicines) {
            Object.assign(response[response.indexOf(mh)].medicines[mh.medicines.indexOf(medicine)],{quantity: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].quantity, servedOut: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].servedOut})
        }
        for (const tests of mh.tests) {
          try {
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result,tester: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].tester})
          } catch (error) {
            
          }
        }
        delete response[response.indexOf(mh)].raw_tests
        delete response[response.indexOf(mh)].raw_medicines
      }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getHc_pSessions = async (req,res)=>{
  try { 
      let {token} = req.body
      let decoded = authenticateToken(token)
      let hcp = decoded.token.id
      if (!hcp) {hcp = req.body.id}
      let response = await query(`SELECT 
      mh.id AS session_id,
      mh.tests as raw_tests,
      mh.comment as comment,
      mh.status as status,
      mh.medicines as raw_medicines,
      payments.amount as payment_amount,
      patients.Full_name as patient_name,
      patients.id as patient_id,
      payments.status as payment_status,
      mh.decision as decision,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', m.name, '"}')), ']') AS medicines,
      COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', t.name, '"}')), ']'), '[]') AS tests
    FROM
      medical_history mh
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN patients ON mh.patient = patients.id
      INNER JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
    WHERE mh.hcp_provider = ?
    GROUP BY
    mh.id;
    `,[hcp])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const mh of response) {
        response[response.indexOf(mh)].medicines = JSON.parse(mh.medicines);
        response[response.indexOf(mh)].decision = JSON.parse(mh.decision);
        response[response.indexOf(mh)].tests = JSON.parse(mh.tests)
        response[response.indexOf(mh)].raw_tests = JSON.parse(mh.raw_tests);
        response[response.indexOf(mh)].raw_medicines = JSON.parse(mh.raw_medicines)    
        for (const medicine of mh.medicines) {
            Object.assign(response[response.indexOf(mh)].medicines[mh.medicines.indexOf(medicine)],{quantity: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].quantity, servedOut: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].servedOut})
        }
        for (const tests of mh.tests) {
          try {
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result,tester: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].tester})
          } catch (error) {
            
          }
        }
        delete response[response.indexOf(mh)].raw_tests
        delete response[response.indexOf(mh)].raw_medicines
      }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const session = async (req,res)=>{
  try { 
    let {session} = req.params
      let response = await query(`SELECT 
      p.full_name AS patient_name,
      mh.id AS session_id,
      mh.tests as raw_tests,
      mh.equipments as raw_equipments,
      mh.services as raw_services,
      mh.operations as raw_operations,
      mh.comment as comment,
      mh.status as status,
      mh.medicines as raw_medicines,
      mh.decision as decisions,
      mh.date as dateadded,
      GROUP_CONCAT(
        DISTINCT 
        JSON_OBJECT('id', p.id, 'name', p.Full_name, 'dob', p.dob,'phone', p.phone, 'location', 
          CONCAT(
            (SELECT name From Provinces Where id = p.resident_province),' , ',
            (SELECT name From districts Where id = p.resident_district),' , ',
            (SELECT name From sectors Where id = p.resident_sector),' , ',
            (SELECT name From cells Where id = p.resident_cell)
          )
        )
      ) AS p_info,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name, 'title', users.title)) AS hcp_info,
      GROUP_CONCAT(
        DISTINCT
         JSON_OBJECT('id', mh.hospital,'phone', hospitals.phone, 'name', hospitals.name, 'location', 
            CONCAT(
              (SELECT name From Provinces Where id = hospitals.province),' , ',
              (SELECT name From districts Where id = hospitals.district),' , ',
              (SELECT name From sectors Where id = hospitals.sector),' , ',
              (SELECT name From cells Where id = hospitals.cell)
            )
        )
      ) AS hp_info,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', a.id, 'name', a.name,'percentage', a.percentage_coverage)) AS assurance_info,
      GROUP_CONCAT(
        DISTINCT
         JSON_OBJECT('id', pm.id, 'status', pm.status, 'a_amount', pm.assurance_amount, 'p_amount', pm.amount)
        ) AS payment_info,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT('id', m.id, 'name', m.name,'unit', m.unit, 'price', (SELECT price FROM medicines where id = m.id))
          ),
        ']'),
      '[]') AS medicines,
      COALESCE(
        CONCAT('[',
         GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', eq.id, 'name', eq.name,'unit', eq.unit, 'price', (SELECT price FROM equipments where id = eq.id))
         ),
        ']'), 
      '[]') AS equipments,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(DISTINCT JSON_OBJECT('id', s.id, 'name', s.name,'unit', s.unit, 'price', (SELECT price FROM services where id = s.id))
          ),
        ']'),
      '[]') AS services,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(DISTINCT JSON_OBJECT('id', t.id, 'name', t.name, 'price', (SELECT price FROM tests where id = t.id))
          ),
        ']'),
      '[]') AS tests,
      COALESCE(
        CONCAT('[',
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT('id', o.id, 'name', o.name, 'price', (SELECT price FROM operations where id = o.id))
          ),
        ']'),
      '[]') AS operations,
      COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', d.id, 'name', d.name)), ']'), '[]') AS departments

  FROM
      medical_history mh
      INNER JOIN patients p ON mh.patient = p.id
      INNER JOIN users ON mh.Hc_provider = users.id
      INNER JOIN hospitals ON mh.hospital = hospitals.id
      INNER JOIN payments as pm ON mh.id = pm.session
      INNER JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
      INNER JOIN equipments as eq ON JSON_CONTAINS(mh.equipments, JSON_OBJECT('id', eq.id), '$')
      INNER JOIN services as s ON JSON_CONTAINS(mh.services, JSON_OBJECT('id', s.id), '$')
      INNER JOIN operations as o ON JSON_CONTAINS(mh.operations, JSON_OBJECT('id', o.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
      LEFT JOIN departments as d ON JSON_CONTAINS(mh.departments, JSON_QUOTE(d.id), '$')
      left join assurances as a on mh.assurance = a.id
  WHERE mh.id = ?
  GROUP BY mh.id;
  
    `,[session])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_sess_404})
      for (const mh of response) {
        response[response.indexOf(mh)].medicines = JSON.parse(mh.medicines);
        response[response.indexOf(mh)].hp_info = JSON.parse(mh.hp_info);
        response[response.indexOf(mh)].hcp_info = JSON.parse(mh.hcp_info);
        response[response.indexOf(mh)].assurance_info = JSON.parse(mh.assurance_info);
        response[response.indexOf(mh)].departments = JSON.parse(mh.departments);
        response[response.indexOf(mh)].decisions = JSON.parse(mh.decisions);
        response[response.indexOf(mh)].tests = JSON.parse(mh.tests)
        response[response.indexOf(mh)].services = JSON.parse(mh.services)
        response[response.indexOf(mh)].equipments = JSON.parse(mh.equipments)
        response[response.indexOf(mh)].operations = JSON.parse(mh.operations)
        response[response.indexOf(mh)].p_info = JSON.parse(mh.p_info)
        response[response.indexOf(mh)].payment_info = JSON.parse(mh.payment_info)
        response[response.indexOf(mh)].raw_tests = JSON.parse(mh.raw_tests);
        response[response.indexOf(mh)].raw_services = JSON.parse(mh.raw_services);
        response[response.indexOf(mh)].raw_operations = JSON.parse(mh.raw_operations);
        response[response.indexOf(mh)].raw_equipments = JSON.parse(mh.raw_equipments);
        response[response.indexOf(mh)].raw_medicines = JSON.parse(mh.raw_medicines)  
        response[response.indexOf(mh)].dateadded = `${new Date(mh.dateadded).getDay()}-${new Date(mh.dateadded).getMonth()}-${new Date(mh.dateadded).getFullYear()}`
        for (const medicine of mh.medicines) {
            Object.assign(response[response.indexOf(mh)].medicines[mh.medicines.indexOf(medicine)],{quantity: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].quantity,servedOut: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].servedOut})
        }
        for (const services of mh.services) {
          Object.assign(response[response.indexOf(mh)].services[mh.services.indexOf(services)],{quantity: response[response.indexOf(mh)].raw_services[mh.services.indexOf(services)].quantity})
        }
        for (const equipment of mh.equipments) {
          Object.assign(response[response.indexOf(mh)].equipments[mh.equipments.indexOf(equipment)],{quantity: response[response.indexOf(mh)].raw_equipments[mh.equipments.indexOf(equipment)].quantity})
        }
        for (const tests of mh.tests) {
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result,tester: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].tester,sample: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].sample})
        }
        for (const operations of mh.operations) {
          Object.assign(response[response.indexOf(mh)].operations[mh.operations.indexOf(operations)],
          {operator: response[response.indexOf(mh)].raw_operations[mh.operations.indexOf(operations)].operator})
        }
        delete response[response.indexOf(mh)].raw_tests
        delete response[response.indexOf(mh)].raw_operations
        delete response[response.indexOf(mh)].raw_services
        delete response[response.indexOf(mh)].raw_equipments
        delete response[response.indexOf(mh)].raw_medicines
      }
      [response] = response
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addSessionTests = async (req,res)=>{
  try {
    let {session,test,token} = req.body
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let tester = decoded.token
      let itt = 0
      var t = await query(`select price from tests where id = ?`, [test.id]);
      if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
      if(t.length == 0) {
        t = {price : 0}
      }else{
         [t] = t
         itt +=t.price
         query(`update medical_history set tests =  JSON_ARRAY_APPEND(tests, '$', JSON_OBJECT("id", ?,"sample", ?, "result", ?, "tester", ?)) where id = ?`,[test.id,test.sample,test.result,tester.id,session])
        }
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_test_404})
      let pts = await calculatePayments(assurance,itt)
      let updatepayment = await query(`update payments set amount = (SElect amount from payments where session = ?) + ?,assurance_amount = (SElect assurance_amount from payments where session = ?) + ? where session = ?`,[session,pts.patient_ammount,session,pts.assurance_ammount,session])
      query(`update medical_history set departments =  JSON_ARRAY_APPEND(departments, '$', ?) where id = ?`,[tester.department,session])
      if (!updatepayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.test_added_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addSessionOperation = async (req,res)=>{
  try {
    let {session,operation,token} = req.body
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let operator = decoded.token
      let itt = 0
      var t = await query(`select price from operations where id = ?`, [operation.id]);
      if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
      if(t.length == 0) {
        t = {price : 0}
      }else{
         [t] = t
         itt +=t.price
         query(`update medical_history set operations =  JSON_ARRAY_APPEND(operations, '$', JSON_OBJECT("id", ?, "operator", ?)) where id = ?`,[operation.id,operator.id,session])
        }
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_operation_404})
      let pts = await calculatePayments(assurance,itt)
      let updatepayment = await query(`update payments set amount = (SElect amount from payments where session = ?) + ?,assurance_amount = (SElect assurance_amount from payments where session = ?) + ? where session = ?`,[session,pts.patient_ammount,session,pts.assurance_ammount,session])
      let update_mh =  await query(`update medical_history set departments =  JSON_ARRAY_APPEND(departments, '$', ?) where id = ?`,[operator.department,session])
      if (!updatepayment || !update_mh) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.operation_addedtosession_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addSessionService = async (req,res)=>{
  try {
    let {session,service,token} = req.body
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let operator = decoded.token
      let itt = 0
      var t = await query(`select price from services where id = ?`, [service.id]);
      if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
      if(t.length == 0) {
        t = {price : 0}
      }else{
         [t] = t
         itt +=(t.price * service.quantity)
         query(`update medical_history set services =  JSON_ARRAY_APPEND(services, '$', JSON_OBJECT("id", ?, "quantity", ?)) where id = ?`,[service.id,service.quantity,session])
        }
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_service_404})
      let pts = await calculatePayments(assurance,itt)
      let updatepayment = await query(`update payments set amount = (SElect amount from payments where session = ?) + ?,assurance_amount = (SElect assurance_amount from payments where session = ?) + ? where session = ?`,[session,pts.patient_ammount,session,pts.assurance_ammount,session])
      let update_mh =  await query(`update medical_history set departments =  JSON_ARRAY_APPEND(departments, '$', ?) where id = ?`,[operator.department,session])
      if (!updatepayment || !update_mh) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.service_addedtosession_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addSessionEquipment = async (req,res)=>{
  try {
    let {session,equipment,token} = req.body
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let operator = decoded.token
      let itt = 0
      var t = await query(`select price from equipments where id = ?`, [equipment.id]);
      if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
      if(t.length == 0) {
        t = {price : 0}
      }else{
         [t] = t
         itt += (t.price * equipment.quantity)
         query(`update medical_history set equipments =  JSON_ARRAY_APPEND(equipments, '$', JSON_OBJECT("id", ?, "quantity", ?)) where id = ?`,[equipment.id,equipment.quantity,session])
        }
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_equipment_404})
      let pts = await calculatePayments(assurance,itt)
      let updatepayment = await query(`update payments set amount = (SElect amount from payments where session = ?) + ?,assurance_amount = (SElect assurance_amount from payments where session = ?) + ? where session = ?`,[session,pts.patient_ammount,session,pts.assurance_ammount,session])
      let update_mh =  await query(`update medical_history set departments =  JSON_ARRAY_APPEND(departments, '$', ?) where id = ?`,[operator.department,session])
      if (!updatepayment || !update_mh) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.equipment_addedtosession_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addSessionMedicine = async (req,res)=>{
  try {
    let {session,medicine,token} = req.body
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let hc_provider = decoded.token.id
      var itt = 0
      let meds = await query(`select medicines from inventories where hospital = ?`, [decoded.token.hospital]);
      [meds] = meds
      meds = JSON.parse(meds.medicines)
      var m = await query(`select price from medicines where id = ?`, [medicine.id]);
      if (!m) return res.status(500).send({success:false, message: errorMessage.is_error})
      if(m.length == 0) {
         m = {price : 0}
        }else{
         [m] = m
         for (const medic of meds) {
          if (medic.id == medicine.id) {
            if (medic.quantity < medicine.quantity) {
              query(`update medical_history set medicines =  JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "quantity", ?, "servedOut", ?)) where id = ? and status != ? AND hc_provider = ?`,[medicine.id,medicine.quantity,true,session,'closed',hc_provider])
            }else{
              itt += (m.price * medicine.quantity)
              query(`update medical_history set medicines =  JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "quantity", ?, "servedOut", ?)) where id = ? and status != ? AND hc_provider = ?`,[medicine.id,medicine.quantity,false,session,'closed',hc_provider])
              meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.quantity)
            }
          }
         }
      }
      console.log(meds)
      query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(meds),decoded.token.hospital])
      // if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_med_404})
      let pts = await calculatePayments(assurance,itt)
      let updatepayment = await query(`update payments set amount = (SElect amount from payments where session = ?) + ?,assurance_amount = (SElect assurance_amount from payments where session = ?) + ? where session = ?`,[session,pts.patient_ammount,session,pts.assurance_ammount,session])
      if (!updatepayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.medicine_addedtosession_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const addSessionDecision = async (req,res)=>{
  try {
    let {session,decisions,token} = req.body
    let decoded = authenticateToken(token)
      let hc_provider = decoded.token.id
      for (const decision of decisions) {
        let addDecisions = await query(`update medical_history
         set decision =  JSON_ARRAY_APPEND(decision,'$',?) 
         where id = ? AND Status != ? AND hc_provider = ?`,[decision,session,'closed',hc_provider]) 
         if (!addDecisions) {
           return res.status(500).send({success:false, message: errorMessage.is_error})
         }else if (addDecisions.affectedRows == 0) {
           return res.status(401).send({success:false, message: errorMessage._err_forbidden})
         }
      }
      res.send({success: true, message: errorMessage.dec_added_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const approvePayment = async (req,res)=>{
  try {
    let {session,token} = req.body
      let decoded = authenticateToken(token)
      let approver = decoded.token.id;
      let updatepayment = await  query(`update payments set status = ?,type = ?, approver = ? where session = ? `,['paid','manually approved payment',approver,session])
      if (!updatepayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }else if (updatepayment.affectedRows == 0) {
        return res.status(404).send({success:false, message: errorMessage._err_ms_404})
      }
      res.send({success: true, message: errorMessage.pAp_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const closeSession = async (req,res)=>{
  try {
    let {session,token} = req.body
      let decoded = authenticateToken(token)
      let Hc_provider = decoded.token.id;
      let close = await  query(`update medical_history set status = ? where id = ? AND hc_provider = ?`,['closed',session,Hc_provider])
      if (!close) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }else if (close.affectedRows == 0) {
        return res.status(401).send({success:false, message: errorMessage._err_forbidden})
      }
      res.send({success: true, message: errorMessage._session_clo_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
