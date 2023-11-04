import query from "../controllers/query.controller"

export async  function findRecs(socket,entity,needle,type,datatofech,coltosearch) {
    try {
        if (!entity) {
            return
        }
        if (type == 'search') {
            datatofech = datatofech.toString();
            let results = await query(`select ${datatofech} from ${entity} where ${coltosearch} like ? `,[`%${needle}%`])
            if (!results) {
                return
            }
            socket.emit('RecsRes',results);
        }
    } catch (error) {
       console.log(error) 
    }
}