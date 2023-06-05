import query from "./query.controller";

export async function checkEmail(needle1,needle2,table) {
    let q = await query(`select email,phone from ${table} where email = ? or phone = ?`, [needle1,needle2])
    return q
}
export async function checkNID(needle,table) {
    let q = await query(`select email,phone from ${table} where nid = ?`, [needle])
    return q
}
export async function checku_name(needle,table) {
    let q = await query(`select email,phone from ${table} where username = ?`, [needle])
    return q
}