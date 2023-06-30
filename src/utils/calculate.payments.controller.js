import query from "../controllers/query.controller";

export async function calculatePayments(assurance,totalPayment) {
    let percentages = await query(`SELECT
     assurances.percentage_coverage
    FROM 
     assurances 
    WHERE
     assurances.id = ?
      `,[assurance])

}