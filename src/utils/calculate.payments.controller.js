import query from "../controllers/query.controller";

export async function calculatePayments(assurance,item,type) {
  let assuranceInfo = await query(`SELECT
   assurances.percentage_coverage,
   rstctd_medicines AS rstrct_medicines,
   rstctd_tests AS rstrct_tests,
   rstctd_operations AS rstrct_operations,
   rstctd_services AS rstrct_services,
   rstctd_equipments AS rstrct_equipments
  FROM 
   assurances 
    LEFT JOIN medicines ON JSON_CONTAINS(assurances.rstctd_medicines, JSON_QUOTE(medicines.id), '$')
    LEFT JOIN tests ON JSON_CONTAINS(assurances.rstctd_tests, JSON_QUOTE(tests.id), '$')
    LEFT JOIN operations ON JSON_CONTAINS(assurances.rstctd_operations, JSON_QUOTE(operations.id), '$')
    LEFT JOIN equipments ON JSON_CONTAINS(assurances.rstctd_equipments, JSON_QUOTE(equipments.id), '$')
    LEFT JOIN services ON JSON_CONTAINS(assurances.rstctd_services, JSON_QUOTE(services.id), '$')
  WHERE
   assurances.id = ?
   group by assurances.id
    `,[assurance])
  let percentages,restrictedItems
  let v = 0
  try {
    if (assuranceInfo.length == 0){
      
    }else{
      v = 1;
      assuranceInfo = assuranceInfo[0]
      assuranceInfo.rstrct_medicines = JSON.parse(assuranceInfo.rstrct_medicines)
      assuranceInfo.rstrct_tests = JSON.parse(assuranceInfo.rstrct_tests)
      assuranceInfo.rstrct_operations = JSON.parse(assuranceInfo.rstrct_operations)
      assuranceInfo.rstrct_services = JSON.parse(assuranceInfo.rstrct_services)
      assuranceInfo.rstrct_equipments = JSON.parse(assuranceInfo.rstrct_equipments)
      percentages = {assurance : assuranceInfo.percentage_coverage, patient: 100 - assuranceInfo.percentage_coverage}
      restrictedItems = {medicines: assuranceInfo.rstrct_medicines, tests: assuranceInfo.rstrct_tests, operations: assuranceInfo.rstrct_operations, equipments: assuranceInfo.rstrct_medicines, services: assuranceInfo.rstrct_services}
    }
    let sum = {assurance_amount : 0, patient_amount : 0}
    if (type) {
      if (!v) {
        for (const key of Object.keys(item)) {
          for (const itm of item[key]) {
            if (!itm.servedOut) {
              sum.patient_amount+= itm.price
            }
          }
        }
        return sum
      }
      for (const key of Object.keys(item)) {
        for (const drug of item[key]) { 
          if (restrictedItems[key].length) {
            if (!drug.servedOut) {
              let restrictedDrug = restrictedItems[key].find(function (restrictedrug) {
                return restrictedrug == drug.id
              }) 
              console.log(restrictedDrug)
              if (!restrictedDrug) {
                sum.assurance_amount+= ((Number(drug.price) * Number(percentages.assurance))/100)
                sum.patient_amount+= ((Number(drug.price) * Number(percentages.patient))/100)
                sum.assurance_amount = Number(sum.assurance_amount.toFixed(2))
                sum.patient_amount = Number(sum.patient_amount.toFixed(2))
              }else{
                sum.patient_amount+= drug.price  
              }
            }
          }else if (!drug.servedOut) {
                sum.assurance_amount+= ((Number(drug.price) * Number(percentages.assurance))/100)
                sum.patient_amount+= ((Number(drug.price) * Number(percentages.patient))/100)
                sum.assurance_amount = Number(sum.assurance_amount.toFixed(2))
                sum.patient_amount = Number(sum.patient_amount.toFixed(2))
          }
        }
      }
      return sum
    } 
    } catch (error) {
      console.log(error)
    }
  }
  