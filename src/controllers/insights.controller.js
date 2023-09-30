import query from "./query.controller"
import errorMessage from "./response.message.controller"

export const insightsStats = async (req,res)=>{
    let {entity,range} = req.body
    let {start,stop} = range
    let query = await query(`
        SELECT mh.results
    `)
}