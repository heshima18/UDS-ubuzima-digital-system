import query from "./query.controller";

export async function checkEmail(needle,table) {
    let q = await query(`select email,phone from ${table} where email = ?`, [needle])
    return q
}
export async function checkPhone(needle,table) {
    let q = await query(`select email,phone from ${table} where phone = ?`, [needle])
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
export async function checkHouseHolder(needle) {
    let q = await query(`select id from patients where nid = ?  AND role = 'householder'`, [needle])
    return q
}
export async function checkObjectAvai(table, column, key, needle,entity, entityId) {
    let q = await query(`SELECT id FROM ${table} where JSON_CONTAINS(${column}, JSON_OBJECT(?, ?), '$') AND ${entity} = ?`,[key,needle,entityId])
    return q
}
export async function getSession(sessionid) {
    let q = await query(`select id,hc_provider,patient,hospital,status from medical_history where id = ?`,[sessionid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getMessage(messageid) {
    let q = await query(`select id,sessionid,user,receiver,status from messages where id = ?`,[messageid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getTest(testid) {
    let q = await query(`select id,type,department from tests where id = ?`,[testid])
    if (!q) {
        return undefined
    }
    return q
}
export async function getPayment(sessionid) {
    let q = await query(`select id,assurance_amount,amount from payments where session = ?`,[sessionid])
    if (!q) {
        return undefined
    }
    return q
}