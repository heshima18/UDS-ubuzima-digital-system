import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
import authenticateToken from './token.verifier.controller';
export const addSession = async (req,res)=>{
  try {
    let {patient,symptoms,tests,decision,departments,medicines,comment,token} = req.body
      let uid = id();
      let decoded = authenticateToken(token)
      let hc_provider = decoded.token.id 
      let hp = decoded.token.hospital
      let insert = await query(`insert into medical_history(id,patient,hospital,departments,hc_provider,symptoms,tests,medicines,decision,comment,status)values(?,?,?,?,?,?,?,?,?,?,?)`,[uid,patient,hp,JSON.stringify(departments),hc_provider,JSON.stringify(symptoms),JSON.stringify(tests),JSON.stringify(medicines),JSON.stringify(decision),comment,'open'])
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
            meds[meds.indexOf(medic)].quantity = parseInt(meds[meds.indexOf(medic)].quantity) - parseInt(medicine.qty)
          }
        }
        var t = await query(`select price from medicines where id = ?`, [medicine.id]);
        [t] = t
        imt +=(t.price * medicine.qty)
      }
      query(`UPDATE inventories  SET medicines = ? where hospital = ?`, [JSON.stringify(meds),hp])
      let tt = itt+imt
      let insertpayment = await query(`insert into payments(id,user,session,amount,status)values(?,?,?,?,?)`,[id(),patient,uid,tt,'awaiting payment'])
      if (!insert || !insertpayment) {
        return res.status(500).send({success:false, message: errorMessage.is_error})
      }
      res.send({success: true, message: errorMessage.session_message})
    
  } catch (error) {
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export const getUsessions = async (req,res)=>{
  try { let {userid} = req.params
      let response = await query(`SELECT 
      p.full_name AS patient_name,
      mh.id AS session_id,
       GROUP_CONCAT(DISTINCT JSON_OBJECT('id', mh.hospital, 'name', hospitals.name)) AS hp_info,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name)) AS hcp_info,
      mh.tests as raw_tests,
      mh.comment as comment,
      mh.decision as decision,
      mh.status as status,
      payments.status as payment_status,
      mh.medicines as raw_medicines,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', m.name, '"}')), ']') AS medicines,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', t.name, '"}')), ']') AS tests

    FROM
      medical_history mh
      INNER JOIN patients p ON mh.patient = p.id
      INNER JOIN (
        SELECT
          JSON_EXTRACT(medicines, '$[*].id') AS medicine_ids,
          JSON_EXTRACT(tests, '$[*].id') AS test_ids,
          mh.id AS history_id
        FROM
          medical_history mh
      ) subq ON subq.history_id = mh.id
      INNER JOIN medicines m ON JSON_CONTAINS(subq.medicine_ids, CONCAT('"', m.id, '"'))
      INNER JOIN tests t ON JSON_CONTAINS(subq.test_ids, CONCAT('"', t.id, '"'))
      INNER JOIN hospitals ON mh.hospital = hospitals.id
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN users ON mh.Hc_provider = users.id
      INNER JOIN departments ON JSON_CONTAINS(mh.departments, JSON_QUOTE(departments.id), '$')
    WHERE mh.patient = ?
    GROUP BY
      p.full_name,
      mh.hospital;
    `,[userid])
      if(!response) return res.status(500).send({success: false, message: errorMessage.is_error})
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
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result})
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
  try { let {session} = req.params
      let response = await query(`SELECT 
      p.full_name AS patient_name,
      mh.id AS session_id,
       GROUP_CONCAT(DISTINCT JSON_OBJECT('id', mh.hospital, 'name', hospitals.name)) AS hp_info,
      CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', departments.id, 'name', departments.name)), ']') AS departments,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('id', users.id, 'name', users.Full_name)) AS hcp_info,
      mh.tests as raw_tests,
      mh.comment as comment,
      mh.decision as decision,
      mh.status as status,
      payments.status as payment_status,
      mh.medicines as raw_medicines,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', m.name, '"}')), ']') AS medicines,
      CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('{"name": "', t.name, '"}')), ']') AS tests

    FROM
      medical_history mh
      INNER JOIN patients p ON mh.patient = p.id
      INNER JOIN (
        SELECT
          JSON_EXTRACT(medicines, '$[*].id') AS medicine_ids,
          JSON_EXTRACT(tests, '$[*].id') AS test_ids,
          mh.id AS history_id
        FROM
          medical_history mh
      ) subq ON subq.history_id = mh.id
      INNER JOIN medicines m ON JSON_CONTAINS(subq.medicine_ids, CONCAT('"', m.id, '"'))
      INNER JOIN tests t ON JSON_CONTAINS(subq.test_ids, CONCAT('"', t.id, '"'))
      INNER JOIN hospitals ON mh.hospital = hospitals.id
      INNER JOIN payments ON mh.id = payments.session
      INNER JOIN users ON mh.Hc_provider = users.id
      INNER JOIN departments ON JSON_CONTAINS(mh.departments, JSON_QUOTE(departments.id), '$')
    WHERE mh.id = ?
    GROUP BY
      p.full_name,
      mh.hospital;
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
            Object.assign(response[response.indexOf(mh)].tests[mh.tests.indexOf(tests)],{result: response[response.indexOf(mh)].raw_tests[mh.tests.indexOf(tests)].result})
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