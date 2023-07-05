import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
import { calculatePayments } from '../utils/calculate.payments.controller';
export const addSession = async (req,res)=>{
  try {
    let {patient,symptoms,tests,decision,departments,medicines,comment,token,assurance,close} = req.body
      let uid = id();
      tests = tests || []
      departments = departments || []
      let decoded = authenticateToken(token)
      medicines = medicines || []
      let hc_provider = decoded.token.id 
      let hp = decoded.token.hospital
      let itt,imt
      itt = 0
      imt = 0
      for (const test of tests) {
        var t = await query(`select price from tests where id = ?`, [test.id]);
        [t] = t
        itt +=t.price
      }
      let meds = await query(`select medicines from inventories where hospital = ?`, [hp]);
      [meds] = meds
      meds = JSON.parse(meds.medicines)
      for (const medicine of medicines) {
        for (const medic of meds) {
          if (medic.id == medicine.id) {
            if (medic.quantity < medicine.quantity) {
              Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: true})
            }else{
              var m = await query(`select price from medicines where id = ?`, [medicine.id]);
              [m] = m
              imt +=(m.price * medicine.qty)
              Object.assign(medicines[medicines.indexOf(medicine)],{servedOut: false})
              meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.quantity)
            }
          }
        }
       
      }
      query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(meds),hp])
      let tt = itt+imt
      let pts = await calculatePayments(assurance,tt)
      let insertpayment = await query(`insert into payments(id,user,session,amount,assurance_amount,status)values(?,?,?,?,?,?)`,[id(),patient,uid,pts.patient_ammount,pts.assurance_ammount,'awaiting payment'])
      let insert = await query(`insert into
       medical_history(id,patient,hospital,departments,hc_provider,symptoms,tests,medicines,decision,comment,status,assurance)values(?,?,?,?,?,?,?,?,?,?,?,?)`,[uid,patient,hp,JSON.stringify(departments),hc_provider,JSON.stringify(symptoms),JSON.stringify(tests),JSON.stringify(medicines),JSON.stringify(decision),comment,(close)? "closed" :"open",assurance])
      query(`update patients set last_diagnosed = (SELECT date FROM medical_history where id = ?) where id = ?`,[uid,patient])
      if (!insert || !insertpayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.session_message})
    
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
            Object.assign(response[response.indexOf(mh)].medicines[mh.medicines.indexOf(medicine)],{qty: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].qty, servedOut: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].servedOut})
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
    
  }
}
export const session = async (req,res)=>{
  try { 
    let {session} = req.params
      let response = await query(`SELECT 
      p.full_name AS patient_name,
      mh.id AS session_id,
      mh.tests as raw_tests,
      mh.comment as comment,
      assurances.name as assurance,
      mh.status as status,
      mh.medicines as raw_medicines,
      payments.amount as payment_amount,
      payments.id as payment_id,
      payments.status as payment_status,
      mh.decision as decision,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name)) AS hcp_info,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', mh.hospital, 'name', hospitals.name)) AS hp_info,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', m.name, '","id": "', m.id, '"}')), ']') AS medicines,
      COALESCE( CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', t.name, '"}')), ']'), '[]') AS tests,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', d.id, 'name', d.name)), ']') AS departments
    FROM
      medical_history mh
      INNER JOIN patients p ON mh.patient = p.id
      INNER JOIN users ON mh.Hc_provider = users.id
      INNER JOIN hospitals ON mh.hospital = hospitals.id
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN medicines AS m ON JSON_CONTAINS(mh.medicines, JSON_OBJECT('id', m.id), '$')
      LEFT JOIN tests AS t ON JSON_CONTAINS(mh.tests, JSON_OBJECT('id', t.id), '$')
      INNER JOIN departments as d ON JSON_CONTAINS(mh.departments, JSON_QUOTE(d.id), '$')
      left join assurances on mh.assurance = assurances.id
    WHERE mh.id = ?
    GROUP BY
    mh.id;
    `,[session])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
      if (response.length == 0) return res.status(404).send({success: false, message: errorMessage._err_sess_404})
      for (const mh of response) {
        response[response.indexOf(mh)].medicines = JSON.parse(mh.medicines);
        response[response.indexOf(mh)].hp_info = JSON.parse(mh.hp_info);
        response[response.indexOf(mh)].hcp_info = JSON.parse(mh.hcp_info);
        response[response.indexOf(mh)].departments = JSON.parse(mh.departments);
        response[response.indexOf(mh)].decision = JSON.parse(mh.decision);
        response[response.indexOf(mh)].tests = JSON.parse(mh.tests)
        response[response.indexOf(mh)].raw_tests = JSON.parse(mh.raw_tests);
        response[response.indexOf(mh)].raw_medicines = JSON.parse(mh.raw_medicines)    
        for (const medicine of mh.medicines) {
            Object.assign(response[response.indexOf(mh)].medicines[mh.medicines.indexOf(medicine)],{qty: response[response.indexOf(mh)].raw_medicines[mh.medicines.indexOf(medicine)].qty})
        }
        for (const tests of mh.tests) {
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result,tester: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].tester})
        }
        delete response[response.indexOf(mh)].raw_tests
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
    let {session,tests,token} = req.body
      let decoded = authenticateToken(token)
      let assurance = await query(`select assurance from medical_history where id = ?`,[session])
      if(!assurance) return res.status(500).send({success: false, message: errorMessage.is_error})
      assurance = assurance[0]
      assurance = assurance.assurance
      let tester = decoded.token
      let itt = 0
      for (const test of tests) {
        var t = await query(`select price from tests where id = ?`, [test.id]);
        if (!t) return res.status(500).send({success:false, message: errorMessage.is_error})
        if(t.length == 0) {
          t = {price : 0}
        }else{
           [t] = t
           itt +=t.price
           query(`update medical_history set tests =  JSON_ARRAY_APPEND(tests, '$', JSON_OBJECT("id", ?, "result", ?, "tester", ?)) where id = ?`,[test.id,test.result,tester.id,session])
          }
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
export const addSessionMedicine = async (req,res)=>{
  try {
    let {session,medicines,token} = req.body
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
      
      for (const medicine of medicines) {
        var m = await query(`select price from medicines where id = ?`, [medicine.id]);
        if (!m) return res.status(500).send({success:false, message: errorMessage.is_error})
        if(m.length == 0) {
           m = {price : 0}
          }else{
           [m] = m
           for (const medic of meds) {
            if (medic.id == medicine.id) {
              if (medic.quantity < medicine.quantity) {
                query(`update medical_history set medicines =  JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "qty", ?, "servedOut", ?)) where id = ? and status != ? AND hc_provider = ?`,[medicine.id,medicine.quantity,true,session,'closed',hc_provider])
              }else{
                itt += (m.price * medicine.quantity)
                query(`update medical_history set medicines =  JSON_ARRAY_APPEND(medicines, '$', JSON_OBJECT("id", ?, "qty", ?, "servedOut", ?)) where id = ? and status != ? AND hc_provider = ?`,[medicine.id,medicine.quantity,false,session,'closed',hc_provider])
                meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.quantity)
              }
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
