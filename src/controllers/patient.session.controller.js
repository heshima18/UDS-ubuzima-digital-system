import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { calculatePayments } from '../utils/calculate.payments.controller';
import { selectPatient } from './patients.controller';
import { ioSendMessage, ioSendMessages } from './message.controller';
import { io } from '../socket.io/connector.socket.io';
import { checkObjectAvai, getPayment, getSession } from './credentials.verifier.controller';
import { DateTime } from 'luxon';
import { getHpEmployeesByDepartment } from './employee.controller';
import { getInventoryEntry } from './inventory.controller';
export const addSession = async (req,res)=>{
  try {
    const leTime = DateTime.now();
    let now = leTime.setZone('Africa/Kigali');
    now = now.toFormat('yyyy-MM-dd HH:mm:ss')
    let {patient,symptoms,tests,decision,departments,medicines,comment,token,assurance,close,equipments,services,operations,weight} = req.body,notify
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
      let testsInventory = await getInventoryEntry(hp,'tests'),operationsInventory = await getInventoryEntry(hp,'operations'),servicesInventory = await getInventoryEntry(hp,'services')
      // return console.log(testsInventory,operationsInventory,servicesInventory)
      let inventory = {testsInventory,operationsInventory,servicesInventory}
      for (const test of tests) {
        let t = inventory.testsInventory.find(function (itest) {
          return test.id == itest.id
        })
        if (!t) {
          t = await query(`select price from tests where id = ?`, [test.id]);
          t = t[0]
        }
        Object.assign(tests[tests.indexOf(test)],{tester: hc_provider})
        if(!t)  return res.status(404).send({success:false, message: errorMessage._err_test_404})
        Object.assign(tests[tests.indexOf(test)],{price: t.price})
        itt +=t.price
      }
      let meds = await query(`select medicines from inventories where hospital = ?`, [hp]);
      if (meds.length) {
        [meds] = meds
        meds = JSON.parse(meds.medicines)
      }else{
        meds = []
      }
      for (const medicine of medicines) {
        var m = await query(`select price from medicines where id = ?`, [medicine.id]);
        for (const medic of meds) {
          if (medic.id == medicine.id) {
            if (Number(medic.quantity) < Number(medicine.quantity)) {
              Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: true, status: null, price: m.price * medicine.quantity})
            }else{
              if(m.length == 0)  return res.status(500).send({success:false, message: errorMessage._err_med_404})
              m = m[0]
              imt +=(m.price * parseInt(medicine.quantity))
              Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: false, price: m.price * parseInt(medicine.quantity)})
             if (medicine.status == 'served') {
                  meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.quantity)
                }
            }
          }
        }
        if (!('servedOut' in medicines[medicines.indexOf(medicine)])) {
          Object.assign(medicines[medicines.indexOf(medicine)], {servedOut : true, price: 0})
        }
        if (!medicine.servedOut && medicine.status != 'served') {
          notify = true
        }
      }
      for (const equipment of equipments) {
        var m = await query(`select price from equipments where id = ?`, [equipment.id]);
        if(m.length == 0)  return res.status(404).send({success:false, message: errorMessage._err_equipment_404})
        m = m[0]
        Object.assign(equipments[equipments.indexOf(equipment)],{price: m.price * parseInt(equipment.quantity)})
        iet +=(m.price * parseInt(equipment.quantity))
      }
      for (const service of services) {
        let m = inventory.servicesInventory.find(function (iservice) {
          return service.id == iservice.id
        })
        if (!m) {
          m = await query(`select price from services where id = ?`, [service.id]);
          m = m[0]
        }
        if(!m)  return res.status(404).send({success:false, message: errorMessage._err_service_404})
        Object.assign(services[services.indexOf(service)],{price: m.price * parseInt(service.quantity)})
        ist +=(m.price * parseInt(service.quantity))
      }
      for (const operation of operations) {
        var m = inventory.operationsInventory.find(function (ioperation) {
          return operation.id == ioperation.id
        })
        if (!m) {
          m = await query(`select price from operations where id = ?`, [operation.id]);
          m = m[0]
        }
        if(!m)  return res.status(404).send({success:false, message: errorMessage._err_operation_404})
        Object.assign(operations[operations.indexOf(operation)],{operator: hc_provider, price: parseInt(m.price)})
        iot +=m.price
      }
      let addins = {medicines, tests, operations, services, equipments}
      query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(meds),hp])
      let tt = itt+imt+iot+ist+iet;
      let pts = await calculatePayments(assurance,addins,'all')
      if (!pts) {
        console.log('error in payments calculations')
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      let insertpayment = await query(`insert into payments(id,user,session,amount,assurance_amount,status,date,assurance)values(?,?,?,?,?,?,?,?)`,[id(),patient,uid,pts.patient_amount,pts.assurance_amount,'awaiting payment',now,assurance])
      let insert = await query(`insert into
       medical_history(id,patient,hospital,departments,hc_provider,symptoms,tests,medicines,decision,comment,status,assurance,services,operations,equipments,p_weight,dateadded)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[uid,patient,hp,JSON.stringify(departments),hc_provider,JSON.stringify(symptoms),JSON.stringify(tests),JSON.stringify(medicines),JSON.stringify(decision),comment,(close)? "closed" :"open",assurance,JSON.stringify(services),JSON.stringify(operations),JSON.stringify(equipments),weight,now])
      query(`update patients set last_diagnosed = CURRENT_TIMESTAMP() where id = ?`,[uid,patient])
      if (!insert || !insertpayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.session_message, id: uid})
      let getP = await selectPatient(patient);
      let extra =  {
        session: uid, 
        patient: getP.id,
        patient_name: getP.Full_name
      }
      let content,title,sender,type
      content = `${getP.Full_name}'s session created successfully`;
      title = `session created successfully !`
      sender = {name: 'system',id: '196371492058'}
      type = `session_message`
      let messageInfo = {type,content,title,sender,receiver: hc_provider,extra}
      let mssg_id = await ioSendMessage(messageInfo)
      if (mssg_id) {
        const recipientSocket = Array.from(io.sockets.sockets.values()).find((sock) => sock.handshake.query.id === hc_provider)
        Object.assign(messageInfo,{id: mssg_id})
        if (recipientSocket) {
            recipientSocket.emit('message',messageInfo)
        }else{
            console.log('recepient is not online')
        }
      }
      if (notify) {
        let employees = await getHpEmployeesByDepartment(decoded.token.hospital,'1790485192')
        if(!employees) return
        getP = await selectPatient(patient)
        employees = employees.map(function (emp) {
          return emp.id
        })
        try {
          let extra =  {
            session: uid, 
            patient: getP.id,
            patient_name: getP.Full_name
          }
          let content,title,sender,type
          content = `incoming medications request for ${getP.Full_name}`;
          title = `medication request`
          sender = {name: 'system',id: '196371492058'}
          type = `session_message`
          let messageInfo = {type,content,title,sender,receivers: employees,extra}
          let mssg_id = await ioSendMessages(messageInfo)
          
        } catch (error) {
          console.log(error)
        }
        
      }
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getUsessions = async (req,res)=>{
  try { 
      let {userid} = req.params
      let {token} = req.body,role
      token = authenticateToken(token)
      token = token.token
      role = token.role
      if (!userid || userid == null) {
        userid = token.id
      }
      let response = await query(`SELECT 
      mh.id AS session_id,
      mh.dateadded,
      mh.status,
      mh.dateclosed,
      GROUP_CONCAT(
        DISTINCT
          JSON_OBJECT('id', mh.hospital,'phone', hospitals.phone, 'name', hospitals.name, 'location', 
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
          JSON_OBJECT('id', pm.id, 'status', pm.status, 'a_amount', pm.assurance_amount, 'p_amount', pm.amount, 'datepaid', pm.datepaid, 'date', pm.date)
        ) AS payment_info
    FROM
      medical_history mh
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN hospitals ON mh.hospital = hospitals.id
      INNER JOIN payments as pm ON mh.id = pm.session
    WHERE mh.patient = ? ${(role != 'hc_provider' && role != 'patient' && role != 'householder' ) ? `AND mh.hospital = ${token.hospital}` : ''}
    GROUP BY mh.id
    ORDER BY mh.dateadded DESC;
    `,[userid])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const mh of response) {
        response[response.indexOf(mh)].hp_info = JSON.parse(mh.hp_info)
        response[response.indexOf(mh)].payment_info = JSON.parse( response[response.indexOf(mh)].payment_info)
        if (!mh.dateclosed) {
          response[response.indexOf(mh)].payment_info = 'N/A'
        }
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
      let hp = decoded.token.hospital
      if (!hcp) {hcp = req.body.hcp}
      let response = await query(`SELECT 
      mh.id AS session_id,
      mh.status as status,
      mh.dateadded as date,
      patients.Full_name as patient_name,
      patients.id as patient_id,
      COALESCE(assurances.name, 'private') as assurance
    FROM
      medical_history mh
      INNER JOIN patients ON mh.patient = patients.id
      LEFT JOIN assurances ON mh.assurance = assurances.id
    WHERE mh.hc_provider = ? and mh.hospital = ?
    GROUP BY
    mh.id order by date desc;
    `,[hcp,hp])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      response = response.map(function (res) {
        res.date = DateTime.fromISO(res.date).toFormat('yyyy-MM-dd')
        return res
      })
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const session = async (req,res)=>{
  try { 
    let {session} = req.params
    let {token} = req.body
    token = authenticateToken(token)
    token = token.token
    const user = token.role
    let response = await query(`SELECT 
    p.full_name AS patient_name,
    mh.id AS session_id,
    mh.tests as raw_tests,
    mh.equipments as raw_equipments,
    mh.services as raw_services,
    mh.operations as raw_operations,
    mh.comment as comment,
    mh.symptoms as symptoms,
    mh.status as status,
    mh.medicines as raw_medicines,
    mh.decision as decisions,
    mh.dateadded as dateadded,
    mh.dateclosed as dateclosed,
    GROUP_CONCAT(
      DISTINCT 
      JSON_OBJECT('id', p.id, 'name', p.Full_name, 'weight', mh.p_weight,'bgroup', p.b_group, 'dob', p.dob,'phone', p.phone,'nid', p.nid, 'location', 
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
        JSON_OBJECT('id', mh.hospital,'phone', hospitals.phone, 'name', hospitals.name, 'location', 
          CONCAT(
            (SELECT name From provinces Where id = hospitals.province),' , ',
            (SELECT name From districts Where id = hospitals.district),' , ',
            (SELECT name From sectors Where id = hospitals.sector),' , ',
            (SELECT name From cells Where id = hospitals.cell)
          )
      )
    ) AS hp_info,
    GROUP_CONCAT(DISTINCT JSON_OBJECT('id', a.id, 'name', a.name,'percentage', a.percentage_coverage)) AS assurance_info,
    GROUP_CONCAT(
      DISTINCT
        JSON_OBJECT('id', pm.id, 'status', pm.status, 'a_amount', pm.assurance_amount, 'p_amount', pm.amount, 'datepaid', pm.datepaid, 'date', pm.date)
      ) AS payment_info,
    COALESCE(
      CONCAT('[',
        GROUP_CONCAT(
          DISTINCT  CASE WHEN m.id IS NOT NULL THEN JSON_OBJECT('id', m.id, 'name', m.name,'unit', m.unit, 'price', (SELECT price FROM medicines where id = m.id))  ELSE NULL END SEPARATOR ',' 
        ),
      ']'),
    '[]') AS medicines,
    COALESCE(
      CONCAT('[',
        GROUP_CONCAT(
        DISTINCT CASE WHEN eq.id IS NOT NULL THEN JSON_OBJECT('id', eq.id, 'name', eq.name,'unit', eq.unit, 'price', (SELECT price FROM equipments where id = eq.id))  ELSE NULL END SEPARATOR ','
        ),
      ']'), 
    '[]') AS equipments,
    COALESCE(
      CONCAT('[',
        GROUP_CONCAT(DISTINCT  CASE WHEN s.id IS NOT NULL THEN JSON_OBJECT('id', s.id, 'name', s.name,'unit', s.unit, 'price', (SELECT price FROM services where id = s.id))  ELSE NULL END SEPARATOR ',' 
        ),
      ']'),
    '[]') AS services,
    COALESCE(
      CONCAT('[',
        GROUP_CONCAT(DISTINCT  CASE WHEN t.id IS NOT NULL THEN JSON_OBJECT('id', t.id, 'name', t.name, 'price', (SELECT price FROM tests where id = t.id), 'tester', tester.Full_name)  ELSE NULL END SEPARATOR ',' 
        ),
      ']'),
    '[]') AS tests,
    COALESCE(
      CONCAT('[',
        GROUP_CONCAT(
          DISTINCT  CASE WHEN o.id IS NOT NULL THEN JSON_OBJECT('id', o.id, 'name', o.name, 'price', (SELECT price FROM operations where id = o.id),'operator', operator.Full_name)  ELSE NULL END SEPARATOR ',' 
        ),
      ']'),
    '[]') AS operations,
    COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT  CASE WHEN d.id IS NOT NULL THEN  JSON_OBJECT('id', d.id, 'name', d.name)  ELSE NULL END SEPARATOR ',' ), ']'), '[]') AS departments

FROM
    medical_history mh
    INNER JOIN patients p ON mh.patient = p.id
    INNER JOIN users ON mh.Hc_provider = users.id
    LEFT JOIN users as tester ON JSON_CONTAINS(mh.tests, JSON_OBJECT('tester', tester.id), '$')
    LEFT JOIN users as operator ON JSON_CONTAINS(mh.operations, JSON_OBJECT('operator', operator.id), '$')
    INNER JOIN hospitals ON mh.hospital = hospitals.id
    INNER JOIN payments as pm ON mh.id = pm.session
    LEFT JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
    LEFT JOIN equipments as eq ON JSON_CONTAINS(mh.equipments, JSON_OBJECT('id', eq.id), '$')
    LEFT JOIN services as s ON JSON_CONTAINS(mh.services, JSON_OBJECT('id', s.id), '$')
    LEFT JOIN operations as o ON JSON_CONTAINS(mh.operations, JSON_OBJECT('id', o.id), '$')
    LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
    LEFT JOIN departments as d ON JSON_CONTAINS(mh.departments, JSON_QUOTE(d.id), '$')
    left join assurances as a on mh.assurance = a.id
WHERE mh.id = ?
GROUP BY mh.id;

  `,[session])
    if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
    if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_sess_404})
    response = response[0]
    response.medicines = JSON.parse(response.medicines);
    response.hp_info = JSON.parse(response.hp_info);
    response.hcp_info = JSON.parse(response.hcp_info);
    response.assurance_info = JSON.parse(response.assurance_info);
    response.departments = JSON.parse(response.departments);
    response.decisions = JSON.parse(response.decisions);
    response.symptoms = JSON.parse(response.symptoms);
    response.tests = JSON.parse(response.tests)
    response.services = JSON.parse(response.services)
    response.equipments = JSON.parse(response.equipments)
    response.operations = JSON.parse(response.operations)
    response.p_info = JSON.parse(response.p_info)
    response.payment_info = JSON.parse(response.payment_info)
    response.raw_tests = JSON.parse(response.raw_tests);
    response.raw_services = JSON.parse(response.raw_services);
    response.raw_operations = JSON.parse(response.raw_operations);
    response.raw_equipments = JSON.parse(response.raw_equipments);
    response.raw_medicines = JSON.parse(response.raw_medicines) 
    response.dateadded = new Intl.DateTimeFormat('en-US',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(response.dateadded));
    (response.dateclosed) ? response.dateclosed = new Intl.DateTimeFormat('en-US',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(response.dateclosed)) : response.dateclosed = 'N/A';
    if (user != 'hc_provider' && user != 'patient' && user != 'householder') {
      delete response.decisions
      delete response.symptoms

    }
    for (const medicine of response.medicines) {
      Object.assign(
        response.medicines[response.medicines.indexOf(medicine)],
        {
          quantity: response.raw_medicines[response.medicines.indexOf(medicine)].quantity,
          servedOut: response.raw_medicines[response.medicines.indexOf(medicine)].servedOut,
          status: response.raw_medicines[response.medicines.indexOf(medicine)].status,
          comment: response.raw_medicines[response.medicines.indexOf(medicine)].comment

        }
      )
      if (user != 'hc_provider' && user != 'patient' && user != 'householder') {
        if (response.raw_medicines[response.medicines.indexOf(medicine)].servedOut) {
          response.medicines.splice(response.medicines.indexOf(medicine), 1)
        }
      }else if (user != 'cashier' && user != 'patient' && user != 'householder') {
        delete response.medicines[response.medicines.indexOf(medicine)].price
      }
    }
    for (const services of response.services) {
      if (user != 'cashier' && user != 'patient' && user != 'householder') {
        delete response.services[response.services.indexOf(services)].price
      }
      Object.assign(response.services[response.services.indexOf(services)],{quantity: response.raw_services[response.services.indexOf(services)].quantity})     
    }
    for (const equipment of response.equipments) {
      if (user != 'cashier' && user != 'patient' && user != 'householder') {
        delete response.equipments[response.equipments.indexOf(equipment)].price
      }
        Object.assign(response.equipments[response.equipments.indexOf(equipment)],{quantity: response.raw_equipments[response.equipments.indexOf(equipment)].quantity})
    }
    for (const tests of response.tests) {
      if (user == 'hc_provider' || user == 'patient' || user == 'householder') {
        Object.assign(response.tests[response.tests.indexOf(tests)],{result: response.raw_tests[response.tests.indexOf(tests)].result,sample: response.raw_tests[response.tests.indexOf(tests)].sample})
      }
    }
    delete response.raw_tests
    delete response.raw_operations
    delete response.raw_services
    delete response.raw_equipments
    delete response.raw_medicines
    if (user != 'hc_provider' && user != 'cashier' && user != 'patient' && user != 'householder') {
      delete response.services
      delete response.tests
      delete response.operations
      delete response.equipments
      delete response.services
      delete response.decisions
    }else if (user != 'cashier' && user != 'patient' && user != 'householder') {
      delete response.assurance_info
    }else if (user == 'cashier') {
      
    }
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
      let hp = decoded.token.hospital
      let itt = 0
      var testsInventory = await getInventoryEntry(hp,'tests')
      var t = testsInventory.find(function (itest) {
        return itest.id == test.id
      })
      if (!t) {
        t = await query(`select price from tests where id = ?`, [test.id]);
        [t] = t
      }
      if (!t) return res.status(404).send({success:false, message: errorMessage._err_test_404})
      
         Object.assign(test,{price: t.price})
         itt +=t.price
         let objectAvai = await checkObjectAvai('medical_history','tests','id',test.id,'id',session)
          if (!objectAvai) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
          }
          if (objectAvai.length) {
            return res.send({success: false, message: errorMessage.err_entr_avai})
          }
         query(`update medical_history set tests =  JSON_ARRAY_APPEND(tests, '$', JSON_OBJECT("id", ?,"sample", ?, "result", ?, "tester", ?)) where id = ?`,[test.id,test.sample,test.result,tester.id,session])
        
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_test_404})
      let pts = await calculatePayments(assurance,{tests: [test]},'tests')
      if (!pts) {
        console.log('error in payments calculations')
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      let payment_info = await getPayment(session)
      if (!payment_info) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      payment_info = payment_info[0] 
      payment_info.assurance_amount +=pts.assurance_amount
      payment_info.amount +=pts.patient_amount
      // return console.log(payment_info)
      let updatepayment = await query(`update payments set amount = ?,assurance_amount = ? where session = ?`,[payment_info.amount,payment_info.assurance_amount,session])
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
      if(!assurance) return res.status(404).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let operator = decoded.token
      let hp = decoded.token.hospital
      let itt = 0
      let operationsInventory = await getInventoryEntry(hp,'operations')
      let t = operationsInventory.find(function (ioperation) {
        return operation.id == ioperation.id
      })
      if (!t) {
        t = await query(`select price from operations where id = ?`, [operation.id]);
        [t] = t
      }
      if (!t) return res.status(500).send({success:false, message: errorMessage._err_operation_404})
         Object.assign(operation,{price: parseInt(t.price)})
         itt +=t.price
         let objectAvai = await checkObjectAvai('medical_history','operations','id',operation.id,'id',session)
          if (!objectAvai) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
          }
          if (objectAvai.length) {
            return res.send({success: false, message: errorMessage.err_entr_avai})
          }
         query(`update medical_history set operations =  JSON_ARRAY_APPEND(operations, '$', JSON_OBJECT("id", ?, "operator", ?)) where id = ?`,[operation.id,operator.id,session])
        
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_operation_404})
      let pts = await calculatePayments(assurance,{operations: [operation]},'operations')
      let payment_info = await getPayment(session)
      if (!payment_info) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      payment_info = payment_info[0] 
      payment_info.assurance_amount +=pts.assurance_amount
      payment_info.amount +=pts.patient_amount
      console.log(payment_info)
      let updatepayment = await query(`update payments set amount = ?,assurance_amount = ? where session = ?`,[payment_info.amount,payment_info.assurance_amount,session])
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
      let operator = decoded.token
      let hp = decoded.token.hospital
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(404).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let servicesInventory = await getInventoryEntry(hp,'services')
      let itt = 0
      let t = servicesInventory.find(function (iservice) {
        return service.id == iservice.id
      })
      if (!t) {
        t = await query(`select price from services where id = ?`, [service.id]);
        [t] = t
      }
      if (!t) return res.status(404).send({success:false, message: errorMessage._err_service_404})
         itt +=(t.price * service.quantity)
         Object.assign(service,{price: t.price * parseInt(service.quantity)})
         let objectAvai = await checkObjectAvai('medical_history','services','id',service.id,'id',session)
          if (!objectAvai) {
            return res.status(500).send({success:false, message: errorMessage.is_error})
          }
          if (objectAvai.length) {
            return res.send({success: false, message: errorMessage.err_entr_avai})
          }
         query(`update medical_history set services =  JSON_ARRAY_APPEND(services, '$', JSON_OBJECT("id", ?, "quantity", ?)) where id = ?`,[service.id,service.quantity,session])
        
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_service_404})
      let pts = await calculatePayments(assurance,{services: [service]},'services')
      let payment_info = await getPayment(session)
      if (!payment_info) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      payment_info = payment_info[0] 
      payment_info.assurance_amount +=pts.assurance_amount
      payment_info.amount +=pts.patient_amount
      let updatepayment = await query(`update payments set amount = ?,assurance_amount = ? where session = ?`,[payment_info.amount,payment_info.assurance_amount,session])
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
        Object.assign(equipment,{price: t.price * parseInt(equipment.quantity)})
        let objectAvai = await checkObjectAvai('medical_history','equipments','id',equipment.id,'id',session)
         if (!objectAvai) {
           return res.status(500).send({success:false, message: errorMessage.is_error})
         }
         if (objectAvai.length) {
           return res.send({success: false, message: errorMessage.err_entr_avai})
         }
        query(`update medical_history set equipments =  JSON_ARRAY_APPEND(equipments, '$', JSON_OBJECT("id", ?, "quantity", ?)) where id = ?`,[equipment.id,equipment.quantity,session])
      }
      
      if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_equipment_404})
      let pts = await calculatePayments(assurance,{equipments : [equipment]},'equipments')
      let payment_info = await getPayment(session)
      if (!payment_info) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      payment_info = payment_info[0] 
      payment_info.assurance_amount +=pts.assurance_amount
      payment_info.amount +=pts.patient_amount
      // return console.log(payment_info)
      let updatepayment = await query(`update payments set amount = ?,assurance_amount = ? where session = ?`,[payment_info.amount,payment_info.assurance_amount,session])
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
    let {session,medicines,token} = req.body,notify
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let hc_provider = decoded.token.id
      var itt = 0
      let meds = await query(`select medicines from inventories where hospital = ?`, [decoded.token.hospital]);
      if (meds.length) {
        [meds] = meds
        meds = JSON.parse(meds.medicines)
      }else{
        meds = []
      }
      let updatepayment
      
      for (const medicine of medicines) {
        let objectAvai =  await checkObjectAvai('medical_history','medicines','id',medicine.id,'id',session)
        if (!objectAvai) {
          return res.status(500).send({success:false, message: errorMessage.is_error})
        }
        if (objectAvai.length) {
          return res.send({success: false, message: errorMessage.err_entr_avai})
        }

        var m = await query(`select price from medicines where id = ?`, [medicine.id]);
        if (!m) return res.status(500).send({success:false, message: errorMessage.is_error})
        if(m.length == 0) {
          m = {price : 0}
        }else{
          [m] = m
          for (const medic of meds) {
            if (medic.id == medicine.id) {
              if (Number(medic.quantity) < Number(medicine.quantity)) {
                Object.assign(medicine, {servedOut : true, status: null})
                Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: true, price: m.price * parseInt(medicine.quantity), status: null})
              }else{
                Object.assign(medicine, {servedOut : false})
                Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: false, price: m.price * parseInt(medicine.quantity)})
                itt += (m.price * medicine.quantity)
                if (medicine.status == 'served') {
                  meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.quantity)
                }
              }
            }
          }
          if (!('servedOut' in medicine)) {
            Object.assign(medicine, {servedOut : true, status : null})
            Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: true, price: 0,status : null})
          }
          if (!medicine.servedOut && medicine.status != 'served') {
            notify = true
          }
          query(`update medical_history set medicines =  JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "quantity", ?, "servedOut", ?, "status",?,"comment", ?)) where id = ? AND hc_provider = ?`,[medicine.id,medicine.quantity,medicine.servedOut,medicine.status,medicine.comment,session,hc_provider])
        }
        query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(meds),decoded.token.hospital])
        // if (itt == 0) return res.status(403).send({success: false, message: errorMessage._err_med_404})
        let pts = await calculatePayments(assurance,{medicines},'medicines')
       let payment_info = await getPayment(session)
      if (!payment_info) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      payment_info = payment_info[0] 
      payment_info.assurance_amount +=pts.assurance_amount
      payment_info.amount +=pts.patient_amount
      updatepayment = await query(`update payments set amount = ?,assurance_amount = ? where session = ?`,[payment_info.amount,payment_info.assurance_amount,session])
      }
      if (!updatepayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.medicine_addedtosession_message})
      if (notify) {
        let employees = await getHpEmployeesByDepartment(decoded.token.hospital,'1790485192')
        if(!employees) return
        let getS = await getSession(session),getP = await selectPatient(getS[0].patient)
        employees = employees.map(function (emp) {
          return emp.id
        })
        try {
          let extra =  {
            session: session, 
            patient: getP.id,
            patient_name: getP.Full_name
          }
          let content,title,sender,type
          content = `incoming medications request for ${getP.Full_name}`;
          title = `medication request`
          sender = {name: 'system',id: '196371492058'}
          type = `session_message`
          let messageInfo = {type,content,title,sender,receivers: employees,extra}
          let mssg_id = await ioSendMessages(messageInfo)
          
        } catch (error) {
          console.log(error)
        }
        
      }
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
      let statsus = await getSession(session)
      if (!statsus) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      statsus = statsus[0].status
      console.log(statsus)
      if (statsus == 'open') {
        return res.status(401).send({success:false, message: errorMessage.err_open_session})
      }
      let updatepayment = await  query(`update payments set status = ?,type = ?, approver = ?,datepaid = CURRENT_TIMESTAMP() where session = ? `,['paid','manually approved payment',approver,session])
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
    const leTime = DateTime.now();
    let now = leTime.setZone('Africa/Kigali');
    now = now.toFormat('yyyy-MM-dd HH:mm:ss')
    let {session,token} = req.body
      let decoded = authenticateToken(token)
      let Hc_provider = decoded.token.id;
      let close = await  query(`update medical_history set status = ?, dateclosed = ? where id = ? AND hc_provider = ?`,['closed',now,session,Hc_provider])
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
export const addSessionComment = async (req,res)=>{
  try {
    let {session,token,comment} = req.body
      let decoded = authenticateToken(token)
      let Hc_provider = decoded.token.id;
      let update = await  query(`update medical_history set comment = ? where id = ?`,[comment,session,Hc_provider])
      if (!update) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }else if (update.affectedRows == 0) {
        return res.status(401).send({success:false, message: errorMessage._err_forbidden})
      }
      res.send({success: true, message: errorMessage.comment_addedtosession_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const markMedicineAsServed = async (req,res) =>{
  let {medicines,session,token} = req.body,decoded = authenticateToken(token)
  try {
    let meds = await query('SELECT medicines FROM medical_history where id = ?',[session])
    let medics = await getInventoryEntry(decoded.token.hospital,'medicines')
    meds = JSON.parse(meds[0].medicines)
    meds = meds.map(function(medicine) {
      for (const medic of medicines) {
        if (medic == medicine.id && !medicine.servedOut) {
          medicine.status = "served"
          medics = medics.map(function (me) {
            if (me.id == medicine.id) {
              me.quantity = Number(me.quantity) - Number(medicine.quantity)
            }
            return me
          })
        }
      }
      return medicine
    })
    let update = await query('UPDATE medical_history SET medicines = ? where id = ?',[JSON.stringify(meds),session])
    query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(medics),decoded.token.hospital])

    if (!update || !meds) {
      return res.status(500).send({success: false, message: errorMessage.is_error})
    }
    res.send({success: true, message: errorMessage.medic_updated_message})
  } catch (error) {
    console.log(error)
    return res.status(500).send({success: false, message: errorMessage.is_error})
  }
}
export const testPay = async (req,res) =>{
  let v = await calculatePayments(794092683,{medicines: [{id: 1594898649, price: 12},{id: 1594898649, price: 12}],tests: [{id: 2332,price: 200}],operations: [{id: 121212, price: 2000}]},'type')
  res.send(v)
}
export const assuranceMH = async (req,res)=>{
  try { 
    let { token,hospital } = req.body
    token = authenticateToken(token)
    token = token.token
    let assurance = token.assurance
    let response = await query(`SELECT
    mh.id AS session_id,
    mh.status as status,
    mh.dateadded as dateadded,
    mh.dateclosed as dateclosed,

    GROUP_CONCAT(
      DISTINCT 
      JSON_OBJECT('id', p.id, 'name', p.Full_name ,'insurance', COALESCE(p.assurances,'[]'))
    ) AS p_info,
    GROUP_CONCAT(
      DISTINCT
        JSON_OBJECT('id', mh.hospital,'phone', hospitals.phone, 'name', hospitals.name, 'location', 
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
        JSON_OBJECT('id', pm.id, 'status', pm.assu_paym_status, 'a_amount', pm.assurance_amount, 'p_amount', pm.amount, 'datepaid', pm.datepaid, 'date', pm.date)
      ) AS payment_info

FROM
    medical_history mh
    INNER JOIN patients p ON mh.patient = p.id
    INNER JOIN users ON mh.Hc_provider = users.id
    LEFT JOIN users as tester ON JSON_CONTAINS(mh.tests, JSON_OBJECT('tester', tester.id), '$')
    LEFT JOIN users as operator ON JSON_CONTAINS(mh.operations, JSON_OBJECT('operator', operator.id), '$')
    INNER JOIN hospitals ON mh.hospital = hospitals.id
    INNER JOIN payments as pm ON mh.id = pm.session
    LEFT JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
    LEFT JOIN equipments as eq ON JSON_CONTAINS(mh.equipments, JSON_OBJECT('id', eq.id), '$')
    LEFT JOIN services as s ON JSON_CONTAINS(mh.services, JSON_OBJECT('id', s.id), '$')
    LEFT JOIN operations as o ON JSON_CONTAINS(mh.operations, JSON_OBJECT('id', o.id), '$')
    LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
    LEFT JOIN departments as d ON JSON_CONTAINS(mh.departments, JSON_QUOTE(d.id), '$')
    left join assurances as a on mh.assurance = a.id
WHERE mh.assurance = ? and mh.hospital = ? and mh.status != ?
GROUP BY mh.id;

  `,[assurance,hospital,'open'])
    if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
    if (response.length == 0) return res.status(404).send({success: false, message: []})
    for (const session of response) {
      response[response.indexOf(session)].hp_info = JSON.parse(session.hp_info);
      response[response.indexOf(session)].p_info = JSON.parse(session.p_info)
      response[response.indexOf(session)].p_info.insurance = JSON.parse(session.p_info.insurance)
      response[response.indexOf(session)].payment_info = JSON.parse(session.payment_info)
      response[response.indexOf(session)].dateclosed = new Date(session.dateclosed).toISOString().split('T')[0]
      response[response.indexOf(session)].dateadded = new Date(session.dateadded).toISOString().split('T')[0]
      response[response.indexOf(session)].p_info.insurance = session.p_info.insurance.find(function (insurance) {
        return insurance.id == assurance
      })
    }
    res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getHpsessions = async (req,res)=>{
  try { 
      let {token,assurance} = req.body
      let decoded = authenticateToken(token)
      let hp = decoded.token.hospital
      if (!hp) {hp = req.body.hospital}
      let response = await query(`SELECT
      mh.id AS session_id,
      mh.status as status,
      mh.dateadded as dateadded,
      mh.dateclosed as dateclosed,
      GROUP_CONCAT(
        DISTINCT 
        JSON_OBJECT('id', p.id, 'name', p.Full_name ,'insurance', COALESCE(p.assurances,'[]'))
      ) AS p_info,
      GROUP_CONCAT(
        DISTINCT
          JSON_OBJECT('id', a.id, 'name', a.name
        )
      ) AS in_info,
      GROUP_CONCAT(
        DISTINCT
          JSON_OBJECT('id', pm.id, 'status', pm.assu_paym_status, 'a_amount', pm.assurance_amount, 'p_amount', pm.amount)
        ) AS payment_info
  
  FROM
      medical_history mh
      INNER JOIN patients p ON mh.patient = p.id
      INNER JOIN users ON mh.Hc_provider = users.id
      LEFT JOIN users as tester ON JSON_CONTAINS(mh.tests, JSON_OBJECT('tester', tester.id), '$')
      LEFT JOIN users as operator ON JSON_CONTAINS(mh.operations, JSON_OBJECT('operator', operator.id), '$')
      INNER JOIN hospitals ON mh.hospital = hospitals.id
      INNER JOIN payments as pm ON mh.id = pm.session
      LEFT JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
      LEFT JOIN equipments as eq ON JSON_CONTAINS(mh.equipments, JSON_OBJECT('id', eq.id), '$')
      LEFT JOIN services as s ON JSON_CONTAINS(mh.services, JSON_OBJECT('id', s.id), '$')
      LEFT JOIN operations as o ON JSON_CONTAINS(mh.operations, JSON_OBJECT('id', o.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
      LEFT JOIN departments as d ON JSON_CONTAINS(mh.departments, JSON_QUOTE(d.id), '$')
      left join assurances as a on mh.assurance = a.id
    WHERE mh.hospital = ? and mh.assurance = ? and mh.status != ?
    GROUP BY
    mh.id;
    `,[hp,assurance,'open'])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      for (const session of response) {
        response[response.indexOf(session)].in_info = JSON.parse(session.in_info);
        response[response.indexOf(session)].p_info = JSON.parse(session.p_info)
        response[response.indexOf(session)].p_info.insurance = JSON.parse(session.p_info.insurance)
        response[response.indexOf(session)].payment_info = JSON.parse(session.payment_info)
        response[response.indexOf(session)].dateadded = new Date(session.dateadded).toISOString().split('T')[0]
        response[response.indexOf(session)].dateclosed = new Date(session.dateclosed).toISOString().split('T')[0]
        response[response.indexOf(session)].p_info.insurance = session.p_info.insurance.find(function (insurance) {
          return insurance.id == assurance
        })
      }
      res.send({success: true, message: response})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const approveAssuPayment = async (req,res)=>{
  try {
    let {assurance,range} = req.body
    console.log(assurance,range)
      let updatepayment = await  query(`
                                        UPDATE 
                                          payments
                                        SET
                                          assu_paym_status = ?
                                        WHERE
                                          date >= ? AND date <= ?
                                        AND
                                          assurance = ?`,['paid',range.min,range.max,assurance])
      if (!updatepayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }else if (updatepayment.affectedRows == 0) {
        return res.send({success:false, message: errorMessage._err_unknown})
      }
      res.send({success: true, message: errorMessage.pAp_message})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getDailyHpSessions = async (req,res)=>{
  try { 
    const leTime = DateTime.now();
    let now = leTime.setZone('Africa/Kigali');
    now = now.toFormat('yyyy-MM-dd')
      let {token} = req.body
      let decoded = authenticateToken(token)
      let hospital = decoded.token.hospital
      let employee = decoded.token.id

      let response = await query(`SELECT 
      mh.id AS session_id,
      mh.status as status,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', payments.id, 'status', payments.status,'type', payments.type,'amount', payments.amount, 'approver', payments.approver )) AS pm_info
    FROM
      medical_history mh
      INNER JOIN payments ON payments.session = mh.id
    WHERE mh.hospital = ? and DATE(mh.dateadded) = ?
    GROUP BY
    mh.id order by mh.dateadded desc;
    `,[hospital,now])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      let object = {tot: 0, ttamihv: 0, opnss: 0, clsdss: 0, trss: 0,pss: 0, ppss: 0}
    response.map(function (res) {
      res.pm_info = JSON.parse(res.pm_info)
        object.tot+=1
        if (res.pm_info.type == "manually approved payment" && res.pm_info.approver == employee) {
          object.ttamihv+= res.pm_info.amount
        }
        if (res.pm_info.status == 'paid') {
          object.pss += 1
        }else{
          object.ppss+=1
        }
        if (res.status == 'open') {
          object.opnss += 1
        }else if (res.status == "closed") {
          object.clsdss += 1
        }else if (res.status == "transferred") {
          object.trss += 1
        }
        return res
      })

      res.send({success: true, message: object})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}