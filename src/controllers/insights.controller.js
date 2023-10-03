import query from "./query.controller"
import errorMessage from "./response.message.controller"
import authenticateToken from "./token.verifier.controller"
import { DateTime } from "luxon";
export const insightsStats = async (req,res)=>{
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        let {entity,needle,range,token} = req.body
        if (!entity || !needle) {
            token = authenticateToken(token)
            token = token.token
            entity = token.limit
            needle = token.location
        }
        if (!range.start || !range.stop) {
            let start_date = `${now.year}-01-01 00:00:00`
           range.start = start_date,range.stop = now.toFormat('yyyy-MM-dd HH:mm:ss')
        }
        let results = await query(`
            SELECT
             mh.decision,
             mh.id,
             mh.symptoms,
             mh.tests,
             mh.medicines,
             mh.dateclosed as date,
             hospitals.id as hpid,
             hospitals.name as hpname,
             CONCAT(
                (SELECT name From provinces Where id = hospitals.province),' , ',
                (SELECT name From districts Where id = hospitals.district),' , ',
                (SELECT name From sectors Where id = hospitals.sector),' , ',
                (SELECT name From cells Where id = hospitals.cell)
              ) as hp_loc,
             GROUP_CONCAT(DISTINCT JSON_OBJECT('id', p.id,'name', p.Full_name)) as p_info
            FROM medical_history as mh
             LEFT JOIN hospitals ON mh.hospital = hospitals.id  AND hospitals.${entity} = ?
             inner join patients as p ON mh.patient = p.id
            WHERE  mh.dateclosed >= ? AND mh.dateclosed <= ? AND mh.status != ?
            GROUP BY mh.id
        `,[needle,range.start,range.stop,'open'])
        if (!results) return res.status(500).send({success: false, message: errorMessage.is_error})
        results = results.map(function (field) {
        field.medicines = JSON.parse(field.medicines)
            field.tests = JSON.parse(field.tests)
            field.symptoms = JSON.parse(field.symptoms)
            field.decision = JSON.parse(field.decision)
            field.p_info = JSON.parse(field.p_info)
            return field
        })
        let groupByHps,groupByProvinces,groupBySectors,groupDistricts,groupByCells,groupByResults
        groupByHps = {}
        groupByResults = {}
        results.forEach(session=>{
            if (!(session.hpname in groupByHps)) {
                let occurences = results.filter(function (occ) {
                    return occ.hpid == session.hpid
                })
                Object.assign(groupByHps,{[session.hpname]: {total: occurences.length, info:{name: session.hpname, id: session.hpid, loc: session.hp_loc}}})
            }
        })
        results.forEach(session=>{
            for (const result of session.decision) {
                if (!(result in groupByResults)) {
                    Object.assign(groupByResults,{[result]: {total: 1}})
                }else{
                    groupByResults[result].total+=1
                }
            }
        })
        groupByResults = {};
          
       

        results.forEach((record) => {
          const decisions = record.decision;
          const hospitalName = record.hpname;
          const hospitalId = record.hpid;

        
          decisions.forEach((decision) => {
            if (!groupByResults[decision]) {
              groupByResults[decision] = {
                total: 0,
                mostAppearance: { hospital: '', id: '', count: 0 },
                hospitalCounts: [],
              };
            }
        
            groupByResults[decision].total++;
            let avai =  groupByResults[decision].hospitalCounts.find(function (needle) {
                return needle.id == hospitalId
            })
            if (!avai) {
                groupByResults[decision].hospitalCounts.push({hospital: hospitalName, id: hospitalId, count: 1})
                if (!groupByResults[decision].mostAppearance.count) {
                    groupByResults[decision].mostAppearance.hospital = hospitalName;
                    groupByResults[decision].mostAppearance.id = hospitalId;
                    groupByResults[decision].mostAppearance.count = 1
                }
            }else{
                groupByResults[decision].hospitalCounts[groupByResults[decision].hospitalCounts.indexOf(avai)].count++;
                if (groupByResults[decision].hospitalCounts[groupByResults[decision].hospitalCounts.indexOf(avai)].count >
                  groupByResults[decision].mostAppearance.count) {
                  groupByResults[decision].mostAppearance.hospital = hospitalName;
                  groupByResults[decision].mostAppearance.id = hospitalId;
                  groupByResults[decision].mostAppearance.count = groupByResults[decision].hospitalCounts[groupByResults[decision].hospitalCounts.indexOf(avai)].count;
                }
            }
          });
        });
        const dataArray = Object.entries(groupByResults);
        dataArray.sort(([, a], [, b]) => b.total - a.total);
        const sortedData = Object.fromEntries(dataArray);
        groupByResults = sortedData
        res.send({success: true, message: {groupByHps,groupByResults}})    
    } catch (error) {
        console.log(error)
        return res.status(500).send({success: false, message: errorMessage.is_error})
    }
    
}