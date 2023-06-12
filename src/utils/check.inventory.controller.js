import query from "../controllers/query.controller";

export async function checkInventory(hospital) {
    let q = await query(`select count(id) as total from inventories where hospital = ?`,[hospital])
    if (q) {
        return q
    }else{
        return null
    }
}