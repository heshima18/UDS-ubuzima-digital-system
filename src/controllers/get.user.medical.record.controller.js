import query from './query.controller'
import errorMessage from './response.message.controller'
const getMh = async (req,res)=>{
  try { let {userid} = req.params
      let response = await query(`SELECT 
      p.full_name AS patient_name,
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
export default getMh