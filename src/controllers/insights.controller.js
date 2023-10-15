import query from "./query.controller"
import errorMessage from "./response.message.controller"
import authenticateToken from "./token.verifier.controller"
import { DateTime } from "luxon";
export const insightsStats = async (req,res)=>{
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        let {entity,needle,range,token,compType} = req.body,avaiGroupings
        if (!entity || !needle) {
            token = authenticateToken(token)
            token = token.token
            entity = token.limit
            needle = token.location
        }
        if (entity == 'province') {
            avaiGroupings = ['districts','sectors','cells','health facilities']
        }else if (entity == 'district') {
            avaiGroupings = ['sectors','cells','health facilities']
        }else if (entity == 'sector'){
            avaiGroupings = ['cells','health facilities']
        }else if (entity == 'cell'){
            avaiGroupings = ['health facilities']
        }
        if (!range.start || !range.stop) {
            let start_date = `${now.year}-${now.month - 1}-${now.day} 00:00:00`
           range.start = start_date,range.stop = now.toFormat('yyyy-MM-dd HH:mm:ss')
        }
        let dateGroupType = getDateIntervalDescription(new Date(range.start), new Date(range.stop));
        console.log(dateGroupType)
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
             GROUP_CONCAT(DISTINCT JSON_OBJECT(
                 'province', (SELECT name From provinces Where id = hospitals.province), 
                 'district', (SELECT name From districts Where id = hospitals.district), 
                 'sector', (SELECT name From sectors Where id = hospitals.sector),
                 'cell', (SELECT name From cells Where id = hospitals.cell)
                )
              ) as hp_loc,
              GROUP_CONCAT(DISTINCT JSON_OBJECT(
                'province',  hospitals.province, 
                'district', hospitals.district, 
                'sector', hospitals.sector,
                'cell', hospitals.cell
               )
             ) as hp_loc_ids,
             GROUP_CONCAT(DISTINCT JSON_OBJECT('id', p.id,'name', p.Full_name)) as p_info
            FROM medical_history as mh
             LEFT JOIN hospitals ON mh.hospital = hospitals.id  AND hospitals.${entity} = ?
             inner join patients as p ON mh.patient = p.id
            WHERE  mh.dateclosed >= ? AND mh.dateclosed <= ? AND mh.status != ?
            GROUP BY mh.id order by mh.dateclosed asc
        `,[needle,range.start,range.stop,'open'])
        if (!results) return res.status(500).send({success: false, message: errorMessage.is_error})
        if (!results.length) return res.status(404).send({success: false, message: errorMessage._err_recs_404})
        results = results.map(function (field) {
            field.medicines = JSON.parse(field.medicines)
            field.tests = JSON.parse(field.tests)
            field.symptoms = JSON.parse(field.symptoms)
            field.decision = JSON.parse(field.decision)
            field.p_info = JSON.parse(field.p_info)
            field.hp_loc = JSON.parse(field.hp_loc)
            field.hp_loc_ids = JSON.parse(field.hp_loc_ids)

            return field
        })
        let groupByHps = {},groupByProvinces = {},groupBySectors = {},groupByDistricts = {},groupByCells = {},groupByResults = {},groupByDates = {}
        results.forEach(session=>{
            if (!(session.hpname in groupByHps)) {
                
                if (compType) {
                    let startDateOccurence = results.filter(function (occ) {
                        return occ.hpid == session.hpid && formatDate(occ.date,compType) == formatDate(range.start,compType)
                    })
                    let stopDateOccurence = results.filter(function (occ) {
                        return occ.hpid == session.hpid && formatDate(occ.date,compType) == formatDate(range.stop,compType)
                    })
                    Object.assign(groupByHps,
                        {
                            [session.hpname]: {
                                total: {
                                    [formatDate(range.start,compType)]: startDateOccurence.length,
                                    [formatDate(range.stop,compType)]: stopDateOccurence.length
                                }, 
                                info:{
                                    name: session.hpname, 
                                    id: session.hpid, 
                                    loc: Object.values(session.hp_loc).toString().replace(/,/gi,", ")
                                }
                            }
                        }
                        )
                }else{
                    let occurences = results.filter(function (occ) {
                        return occ.hpid == session.hpid
                    })
                    Object.assign(groupByHps,{[session.hpname]: {total: occurences.length, info:{name: session.hpname, id: session.hpid, loc: Object.values(session.hp_loc).toString().replace(/,/gi,", ")}}})
                }
            }
            if (!(session.hp_loc.sector in groupBySectors)) {
                if (compType) {
                    let startDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.sector == session.hp_loc.sector && formatDate(occ.date,compType) == formatDate(range.start,compType)
                    })
                    let stopDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.sector == session.hp_loc.sector && formatDate(occ.date,compType) == formatDate(range.stop,compType)
                    })
                    Object.assign(groupBySectors,
                        {
                            [session.hp_loc.sector]: {
                                total: {
                                    [formatDate(range.start,compType)]: startDateOccurence.length,
                                    [formatDate(range.stop,compType)]: stopDateOccurence.length
                                }, 
                                info:{
                                    name: session.hp_loc.sector, 
                                    id: session.hp_loc_ids.sector, 
                                    loc: `${session.hp_loc.province}, ${session.hp_loc.district}`
                                }
                            }
                        })
                }else{
                    let occurences = results.filter(function (occ) {
                        return occ.hp_loc.sector == session.hp_loc.sector
                    })
                    Object.assign(groupBySectors,
                        {
                            [session.hp_loc.sector]: {
                                total: occurences.length, 
                                info:{
                                    name: session.hp_loc.sector, 
                                    id: session.hp_loc_ids.sector, 
                                    loc: `${session.hp_loc.province}, ${session.hp_loc.district}`
                                }
                            }
                        })

                }
            }
            const fDate = formatDate(session.date,dateGroupType)
            if (!(fDate in groupByDates)) {
                let occurences = results.filter(function (occ) {
                    return formatDate(occ.date,dateGroupType) == fDate
                })
                Object.assign(groupByDates,
                    {
                        [fDate]: {
                            total: occurences.length
                        }
                    })
            }
            if (!(session.hp_loc.province in groupByProvinces)) {
                if (compType) {
                    let startDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.province == session.hp_loc.province && formatDate(occ.date,compType) == formatDate(range.start,compType)
                    })
                    let stopDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.province == session.hp_loc.province && formatDate(occ.date,compType) == formatDate(range.stop,compType)
                    })
                    Object.assign(groupByProvinces,
                        {
                            [session.hp_loc.province]: {
                                total: {
                                    [formatDate(range.start,compType)]: startDateOccurence.length,
                                    [formatDate(range.stop,compType)]: stopDateOccurence.length
                                }, 
                                info:{
                                    name: session.hp_loc.province, 
                                    id: session.hp_loc_ids.province, 
                                    loc: `rwanda`
                                }
                            }
                        })
                }else{
                    let occurences = results.filter(function (occ) {
                        return occ.hp_loc.province == session.hp_loc.province
                    })
                    Object.assign(groupByProvinces,
                        {
                            [session.hp_loc.province]: {
                                total: occurences.length, 
                                info:{
                                    name: session.hp_loc.province, 
                                    id: session.hp_loc_ids.province, 
                                    loc: `rwanda`
                                }
                            }
                        })
                }
            }
            if (!(session.hp_loc.district in groupByDistricts)) {
                if (compType) {
                    let startDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.district == session.hp_loc.district && formatDate(occ.date,compType) == formatDate(range.start,compType)
                    })
                    let stopDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.district == session.hp_loc.district && formatDate(occ.date,compType) == formatDate(range.stop,compType)
                    })
                    Object.assign(groupByDistricts,
                        {
                            [session.hp_loc.district]: {
                                total: {
                                    [formatDate(range.start,compType)]: startDateOccurence.length,
                                    [formatDate(range.stop,compType)]: stopDateOccurence.length
                                }, 
                                info:{
                                    name: session.hp_loc.district, 
                                    id: session.hp_loc_ids.district, 
                                    loc: `${session.hp_loc.province}`
                                }
                            }
                        })
                }else{
                    let occurences = results.filter(function (occ) {
                        return occ.hp_loc.district == session.hp_loc.district
                    })
                    Object.assign(groupByDistricts,
                        {
                            [session.hp_loc.district]: {
                                total: occurences.length, 
                                info:{
                                    name: session.hp_loc.district, 
                                    id: session.hp_loc_ids.district, 
                                    loc: `${session.hp_loc.province}`
                                }
                            }
                        })
                }
            }
            if (!(session.hp_loc.cell in groupByCells)) {
                if (compType) {
                    let startDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.cell == session.hp_loc.cell && formatDate(occ.date,compType) == formatDate(range.start,compType)
                    })
                    let stopDateOccurence = results.filter(function (occ) {
                        return occ.hp_loc.cell == session.hp_loc.cell && formatDate(occ.date,compType) == formatDate(range.stop,compType)
                    })
                    Object.assign(groupByCells,
                        {
                            [session.hp_loc.cell]: {
                                total: {
                                    [formatDate(range.start,compType)]: startDateOccurence.length,
                                    [formatDate(range.stop,compType)]: stopDateOccurence.length
                                }, 
                                info:{
                                    name: session.hp_loc.cell, 
                                    id: session.hp_loc_ids.cell, 
                                    loc: `${session.hp_loc.province}, ${session.hp_loc.district}, ${session.hp_loc.sector}`
                                }
                            }
                        })
                }else{
                    let occurences = results.filter(function (occ) {
                        return occ.hp_loc.cell == session.hp_loc.cell
                    })
                    Object.assign(groupByCells,
                        {
                            [session.hp_loc.cell]: {
                                total: occurences.length, 
                                info:{
                                    name: session.hp_loc.cell, 
                                    id: session.hp_loc_ids.cell, 
                                    loc: `${session.hp_loc.province}, ${session.hp_loc.district}, ${session.hp_loc.sector}`
                                }
                            }
                        })
                }
            }
            const decisions = session.decision;
            const hospitalName = session.hpname;
            const hospitalId = session.hpid;
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
        })
        
        const dataArray = Object.entries(groupByResults);
        dataArray.sort(([, a], [, b]) => b.total - a.total);
        const sortedData = Object.fromEntries(dataArray);
        groupByResults = sortedData
        res.send({success: true, message: {groupByHps,groupByResults,avaiGroupings,groupBySectors,groupByProvinces,groupByDistricts,groupByCells,groupByDates}})    
    } catch (error) {
        console.log(error)
        return res.status(500).send({success: false, message: errorMessage.is_error})
    }
    
}
function formatDate(date,type) {
    let options
    if (type == 'year') {
        options = {year: 'numeric'}
    }else if (type == 'month') {
        options = {year: 'numeric', month: 'short'}
    }else {
        options = {year: 'numeric', month: 'short',day: 'numeric'}
    }
   return new Date(date).toLocaleDateString(undefined,options)
}
function getDateIntervalDescription(startDate, endDate) {
    const luxonStartDate = DateTime.fromJSDate(startDate);
    const luxonEndDate = DateTime.fromJSDate(endDate);
    
    const diff = luxonEndDate.diff(luxonStartDate, ["years", "months", "days"]).toObject();
    
    console.log(diff)
    if (diff.years > 0) {
      return "year";
    } else if (diff.months > 0) {
      return "month";
    } else if (diff.days > 0) {
      return "day";
    }
}  