import query from "../controllers/query.controller";

export async function calculatePayments(assurance,totalPayment) {
    let percentages = await query(`SELECT
     assurances.percentage_coverage
    FROM 
     assurances 
    WHERE
     assurances.id = ?
      `,[assurance])
    if (percentages.length == 0) {percentages = [{percentage_coverage : 0}]}
    [percentages] = percentages
    percentages = percentages.percentage_coverage
    let the_assu_am = (totalPayment * percentages)/100
    // the_assu_am = the_assu_am.toFixed(2);
    let the_pati_am = totalPayment - the_assu_am
    return { assurance_amount: the_assu_am,patient_amount: the_pati_am }
}