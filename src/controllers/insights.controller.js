import { getMedInfo } from "./medicine.controller";
import query from "./query.controller"
import errorMessage from "./response.message.controller"
import { getTestInfo } from "./tests.controller";
import authenticateToken from "./token.verifier.controller"
import { DateTime } from "luxon";
export const insightsStats = async (req,res)=>{
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        let {entity,needle,range,token,compType} = req.body,avaiGroupings = []
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
        avaiGroupings.push('tests','medications')
        if (!range.start || !range.stop) {
            let start_date = `${now.year}-${now.month - 1}-${now.day} 00:00:00`
            range.start = start_date,range.stop = now.toFormat('yyyy-MM-dd HH:mm:ss')
        }
        let dateGroupType = getDateIntervalDescription(new Date(range.start), new Date(range.stop));
        let results = await query(`
            SELECT
            COALESCE(
                CONCAT('[',
                  GROUP_CONCAT(
                    DISTINCT  CASE WHEN dis.id IS NOT NULL THEN JSON_QUOTE(dis.name) END SEPARATOR ','  
                  ),
                ']'),
              '[]') AS decision,
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
            left join patients as p ON mh.patient = p.id
            LEFT JOIN diseases as dis ON JSON_CONTAINS(mh.decision, JSON_QUOTE(dis.id), '$')
            WHERE  mh.dateclosed >= ? AND mh.dateclosed <= ? AND mh.status != ?
            GROUP BY mh.id order by mh.dateclosed asc
        `,[needle,range.start,range.stop,'open'])
        if (!results) return res.status(500).send({success: false, message: errorMessage.is_error})
        if (!results.length) return res.status(404).send({success: false, message: errorMessage._err_recs_404})
        results = await Promise.all(results.map(async function (field) {
            field.medicines = JSON.parse(field.medicines);
            field.tests = JSON.parse(field.tests);
            field.tests = await Promise.all(field.tests.map(async function (test) {
                let testsInfo = await getTestInfo(test.id);

                return {id: test.id,name: testsInfo.name, result: test.result};
            }));
            field.medicines = await Promise.all(field.medicines.map(async function (medicine) {
                let medicinesInfo = await getMedInfo(medicine.id);
                return {id: medicine.id,name: medicinesInfo.name};
            }));
            field.symptoms = JSON.parse(field.symptoms);
            field.decision = JSON.parse(field.decision);
            field.p_info = JSON.parse(field.p_info);
            field.hp_loc = JSON.parse(field.hp_loc);
            field.hp_loc_ids = JSON.parse(field.hp_loc_ids);
            return field;
        }));
        let groupByHps = {},groupByProvinces = {},groupBySectors = {},groupByDistricts = {},groupByCells = {},groupByResults = {},groupByDates = {},groupByMeds = {},groupByTests = {},groupByEmptyDiags = {}, groupByMedSuccessRate = {},groupByMedsSideEffect = {}
        results.forEach(async (session)=>{
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
            const tests = session.tests;
            const Meds = session.medicines;
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
            tests.map(async (test) => {
                try {
                    if (!groupByTests[test.name]) {
                        groupByTests[test.name] = {
                            id: test.id,
                            total: 0,
                            resultsCounts: [],
                        };
                    }
                    
                    groupByTests[test.name].total++;
                    if (groupByTests[test.name].id == test.id) {
                        let avai = groupByTests[test.name].resultsCounts.find(function (rslt) {
                            return rslt.name == test.result
                        })
                        if (avai) {
                            groupByTests[test.name].resultsCounts[groupByTests[test.name].resultsCounts.indexOf(avai)].total++;
                        } else {
                            groupByTests[test.name].resultsCounts.push({name: test.result, total: 1 });
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            Meds.map(async (Med) => {
                try {
                    if (!groupByMeds[Med.name]) {
                        groupByMeds[Med.name] = {
                            id: Med.id,
                            total: 0,
                            resultsCounts: [],
                        };
                    }
                    groupByMeds[Med.name].total++;
                } catch (error) {
                    console.log(error);
                }
            });
            
            
        })
        const dataArray = Object.entries(groupByResults);
        dataArray.sort(([, a], [, b]) => b.total - a.total);
        const sortedData = Object.fromEntries(dataArray);
        groupByResults = sortedData
        res.send({success: true, message: {groupByHps,groupByResults,avaiGroupings,groupBySectors,groupByProvinces,groupByDistricts,groupByCells,groupByDates,groupByMeds,groupByTests,groupByEmptyDiags,groupByMedSuccessRate,groupByMedsSideEffect}})    
    } catch (error) {
        console.log(error)
        return res.status(500).send({success: false, message: errorMessage.is_error})
    }
    
}
export const DGinsightsStats = async (req,res)=>{
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        let {hospital,range,token,compType} = req.body,avaiGroupings = []
        token = authenticateToken(token)
        token = token.token
        hospital = token.hospital
        if (!hospital) {
            hospital = req.params.hospital
        }
        avaiGroupings.push('tests','medications','results')
        if (!range.start || !range.stop) {
            let start_date = `${now.year}-${now.month - 1}-${now.day} 00:00:00`
            range.start = start_date,range.stop = now.toFormat('yyyy-MM-dd HH:mm:ss')
        }
        let dateGroupType = getDateIntervalDescription(new Date(range.start), new Date(range.stop));
        let results = await query(`
            SELECT
            COALESCE(
                CONCAT('[',
                  GROUP_CONCAT(
                    DISTINCT CASE WHEN dis.id IS NOT NULL THEN JSON_OBJECT('id', dis.id, 'name', dis.name) END SEPARATOR ','  
                  ),
                ']'),
              '[]') AS decision,
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
             GROUP_CONCAT(DISTINCT JSON_OBJECT('id', p.id,'name', p.Full_name,'age',p.DOB, 'gender', p.gender)) as p_info
            FROM medical_history as mh
             LEFT JOIN hospitals ON mh.hospital = hospitals.id
             left join patients as p ON mh.patient = p.id
             LEFT JOIN diseases as dis ON JSON_CONTAINS(mh.decision, JSON_QUOTE(dis.id), '$')
            WHERE  mh.dateclosed >= ? AND mh.dateclosed <= ? AND mh.status != ? AND mh.hospital = ?
            GROUP BY mh.id order by mh.dateclosed asc
        `,[range.start,range.stop,'open', hospital])
        if (!results) return res.status(500).send({success: false, message: errorMessage.is_error})
        if (!results.length) return res.status(404).send({success: false, message: errorMessage._err_recs_404})
        results = await Promise.all(results.map(async function (field) {
            field.medicines = JSON.parse(field.medicines);
            field.tests = JSON.parse(field.tests);
            field.tests = await Promise.all(field.tests.map(async function (test) {
                let testsInfo = await getTestInfo(test.id);
                if (testsInfo) {
                    return {id: test.id,name: testsInfo.name, result: test.result};
                }
            }));
            field.medicines = await Promise.all(field.medicines.map(async function (medicine) {
                let medicinesInfo = await getMedInfo(medicine.id);
                return {id: medicine.id,name: medicinesInfo.name};
            }));
            field.symptoms = JSON.parse(field.symptoms);
            field.decision = JSON.parse(field.decision);
            field.p_info = JSON.parse(field.p_info);
            field.hp_loc = JSON.parse(field.hp_loc);
            field.hp_loc_ids = JSON.parse(field.hp_loc_ids);
            return field;
        }));
        let groupByResults = {},groupByDates = {},groupByMeds = {},groupByTests = {},groupByEmptyDiags = {}, groupByMedSuccessRate = {},groupByMedsSideEffect = {}
        results.forEach(async (session)=>{
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
            const decisions = session.decision;
            const tests = session.tests;
            const Meds = session.medicines;
            const p_info = {
                age: now.diff(DateTime.fromFormat(session.p_info.age,'yyyy-yy-dd'), ["years", "months", "days"]).toObject().years,
                gender: session.p_info.gender
            }
            decisions.forEach((decision) => {
              if (!groupByResults[decision.name]) {
                groupByResults[decision.name] = {
                  total: (compType)? {
                    [formatDate(range.start,compType)]: 0,
                    [formatDate(range.stop,compType)]: 0
                  } : 0,
                  mostAppearance: {date: '', count: 0 },
                  dateCounts: [],
                  id: decision.id,
                  name: decision.name,
                  genderCount: 
                        {
                            male: 0,
                            female: 0,
                        }
                };
              }
              if (compType) {
                if (formatDate(session.date,compType) == formatDate(range.start,compType)) {
                  groupByResults[decision.name].total[formatDate(range.start,compType)]++;
                }else if (formatDate(session.date,compType) == formatDate(range.stop,compType)) {
                  groupByResults[decision.name].total[formatDate(range.stop,compType)]++; 
                }
              }else{
                  groupByResults[decision.name].total++;
              }
              let avai =  groupByResults[decision.name].dateCounts.find(function (needle) {
                  return needle.date == formatDate(session.date,'month')
              })
              if (p_info.gender == 'male') {
                groupByResults[decision.name].genderCount.male+=1
              }else{
                groupByResults[decision.name].genderCount.female+=1
              }
              if (!avai) {
                  groupByResults[decision.name].dateCounts.push({date: formatDate(session.date,'month'), count: 1})
                  if (!groupByResults[decision.name].mostAppearance.count) {
                      groupByResults[decision.name].mostAppearance.date = formatDate(session.date,'month');
                      groupByResults[decision.name].mostAppearance.count = 1
                  }
              }else{
                  groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].count++;
                  if (groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].count >
                    groupByResults[decision.name].mostAppearance.count) {
                    groupByResults[decision.name].mostAppearance.date = groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].date;
                    groupByResults[decision.name].mostAppearance.count = groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].count;
                  }
              }
            });
            tests.map(async (test) => {
                try {
                    if (test) {
                        if (!groupByTests[test.name]) {
                            groupByTests[test.name] = {
                                id: test.id,
                                total: (compType)? {
                                    [formatDate(range.start,compType)]: 0,
                                    [formatDate(range.stop,compType)]: 0
                                  } : 0,
                                resultsCounts: [],
                            };
                        }
                        if (compType) {
                            if (formatDate(session.date,compType) == formatDate(range.start,compType)) {
                             groupByTests[test.name].total[formatDate(range.start,compType)]++;
                            }else if (formatDate(session.date,compType) == formatDate(range.stop,compType)) {
                             groupByTests[test.name].total[formatDate(range.stop,compType)]++; 
                            }
                          }else{
                              groupByTests[test.name].total++;
                          }
                        if (groupByTests[test.name].id == test.id) {
                            let avai = groupByTests[test.name].resultsCounts.find(function (rslt) {
                                return rslt.name == test.result
                            })
                            if (avai) {
                                groupByTests[test.name].resultsCounts[groupByTests[test.name].resultsCounts.indexOf(avai)].total++;
                            } else {
                                groupByTests[test.name].resultsCounts.push({name: test.result, total: 1 });
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            Meds.map(async (Med) => {
                try {
                    if (!groupByMeds[Med.name]) {
                        groupByMeds[Med.name] = {
                            id: Med.id,
                            total: (compType)? {
                                [formatDate(range.start,compType)]: 0,
                                [formatDate(range.stop,compType)]: 0
                              } : 0,
                            resultsCounts: [],
                        };
                    }
                    if (compType) {
                        if (formatDate(session.date,compType) == formatDate(range.start,compType)) {
                         groupByMeds[Med.name].total[formatDate(range.start,compType)]++;
                        }else if (formatDate(session.date,compType) == formatDate(range.stop,compType)) {
                         groupByMeds[Med.name].total[formatDate(range.stop,compType)]++; 
                        }
                      }else{
                        groupByMeds[Med.name].total++;
                      }
                } catch (error) {
                    console.log(error);
                }
            });
            
            
        })
        const dataArray = Object.entries(groupByResults);
        dataArray.sort(([, a], [, b]) => b.total - a.total);
        const sortedData = Object.fromEntries(dataArray);
        groupByResults = sortedData
        res.send({success: true, message: {groupByResults,avaiGroupings,groupByDates,groupByMeds,groupByTests,groupByEmptyDiags,groupByMedSuccessRate,groupByMedsSideEffect}})    
    } catch (error) {
        console.log(error)
        return res.status(500).send({success: false, message: errorMessage.is_error})
    }
    
}
export const DGResinsightsStats = async (req,res)=>{
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        let {hospital,range,token,result,gap} = req.body,avaiGroupings = [],ageObj
        token = authenticateToken(token)
        token = token.token
        hospital = token.hospital
        if (!hospital) {
            hospital = req.params.hospital
        }
        if (!gap) {
           gap = 5 
        }
        gap = Number(gap)
        ageObj = gnGapObj(gap)
        avaiGroupings.push('tests','medications','results','age')
        if (!range.start || !range.stop) {
            let start_date = `${now.year}-${now.month - 1}-${now.day} 00:00:00`
            range.start = start_date,range.stop = now.toFormat('yyyy-MM-dd HH:mm:ss')
        }
        let dateGroupType = getDateIntervalDescription(new Date(range.start), new Date(range.stop));
        let results = await query(`
            SELECT
            COALESCE(
                CONCAT('[',
                  GROUP_CONCAT(
                    DISTINCT CASE WHEN dis.id IS NOT NULL THEN JSON_OBJECT('id', dis.id, 'name', dis.name) END SEPARATOR ','  
                  ),
                ']'),
              '[]') AS decision,
             mh.id,
             mh.dateclosed as date,
             GROUP_CONCAT(DISTINCT JSON_OBJECT('id', p.id,'name', p.Full_name,'age',p.DOB, 'gender', p.gender)) as p_info
            FROM medical_history as mh
             left join patients as p ON mh.patient = p.id
             LEFT JOIN diseases as dis ON JSON_CONTAINS(mh.decision, JSON_QUOTE(dis.id), '$')
            WHERE  mh.dateclosed >= ? AND mh.dateclosed <= ? AND mh.status != ? AND mh.hospital = ? AND JSON_CONTAINS(mh.decision, JSON_QUOTE(?), '$')
            GROUP BY mh.id order by mh.dateclosed asc
        `,[range.start,range.stop,'open', hospital,result])
        if (!results) return res.status(500).send({success: false, message: errorMessage.is_error})
        if (!results.length) return res.status(404).send({success: false, message: errorMessage._err_recs_404})
        results = await Promise.all(results.map(async function (field) {
            field.decision = JSON.parse(field.decision);
            field.p_info = JSON.parse(field.p_info);
            return field;
        }));
        let groupByResults = {}
        results.forEach(async (session)=>{
            let decisions = session.decision;
            const p_info = {
                age: now.diff(DateTime.fromFormat(session.p_info.age,'yyyy-yy-dd'), ["years", "months", "days"]).toObject().years,
                gender: session.p_info.gender
            }
            decisions = decisions.filter(function (decision) {
                return decision.id == result
            })
            decisions.forEach((decision) => {
              if (!groupByResults[decision.name]) {
                groupByResults[decision.name] = {
                  total: (dateGroupType)? {
                    [formatDate(range.start,dateGroupType)]: 0,
                    [formatDate(range.stop,dateGroupType)]: 0
                  } : 0,
                  mostAppearance: {date: '', count: 0 },
                  dateCounts: [],
                  count: 1,
                  id: decision.id,
                  name: decision.name,
                  genderCount: 
                        {
                            male: 0,
                            female: 0,
                        },
                  groupByAges: []
                };
              }
              groupByResults[decision.name].count++;
              if (dateGroupType) {
                if (formatDate(session.date,dateGroupType) == formatDate(range.start,dateGroupType)) {
                  groupByResults[decision.name].total[formatDate(range.start,dateGroupType)]++;
                }else if (formatDate(session.date,dateGroupType) == formatDate(range.stop,dateGroupType)) {
                  groupByResults[decision.name].total[formatDate(range.stop,dateGroupType)]++; 
                }
              }else{
                  groupByResults[decision.name].total++;
              }
              let avai =  groupByResults[decision.name].dateCounts.find(function (needle) {
                  return needle.date == formatDate(session.date,'month')
              })
              let ageG = ageObj.find(function (group) {
                if (group.min <= p_info.age && group.max > p_info.age) {
                    return group
                }
              })
              let avaiAgeGroup = groupByResults[decision.name].groupByAges.find(function (needle) {
                return needle.range == ageG.name
              })
              if (!avaiAgeGroup) {
                groupByResults[decision.name].groupByAges.push({range: ageG.name, count: 1, genders: {male: (p_info.gender == 'male')? 1 : 0 , female: (p_info.gender == 'female')? 1 : 0}})
              }else{
                groupByResults[decision.name].groupByAges[groupByResults[decision.name].groupByAges.indexOf(avaiAgeGroup)].count++;
                if (p_info.gender == 'male') {
                    groupByResults[decision.name].groupByAges[groupByResults[decision.name].groupByAges.indexOf(avaiAgeGroup)].genders.male++;
                }else{
                    groupByResults[decision.name].groupByAges[groupByResults[decision.name].groupByAges.indexOf(avaiAgeGroup)].genders.female++;
                }
              }
              if (p_info.gender == 'male') {
                groupByResults[decision.name].genderCount.male+=1
              }else{
                groupByResults[decision.name].genderCount.female+=1
              }
              if (!avai) {
                  groupByResults[decision.name].dateCounts.push({date: formatDate(session.date,'month'), count: 1,genders: {male: (p_info.gender == 'male')? 1 : 0 , female: (p_info.gender == 'female')? 1 : 0}})
                  if (!groupByResults[decision.name].mostAppearance.count) {
                      groupByResults[decision.name].mostAppearance.date = formatDate(session.date,'month');
                      groupByResults[decision.name].mostAppearance.count = 1
                  }
              }else{
                  groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].count++;
                  if (p_info.gender == 'male') {
                    groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].genders.male++;
                  }else{
                    groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].genders.female++;
                  }
                  if (groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].count >
                    groupByResults[decision.name].mostAppearance.count) {
                    groupByResults[decision.name].mostAppearance.date = groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].date;
                    groupByResults[decision.name].mostAppearance.count = groupByResults[decision.name].dateCounts[groupByResults[decision.name].dateCounts.indexOf(avai)].count;
                  }
              }
            });
        })
        const dataArray = Object.entries(groupByResults);
        dataArray.sort(([, a], [, b]) => b.total - a.total);
        const sortedData = Object.fromEntries(dataArray);
        groupByResults = sortedData
        res.send({success: true, message: groupByResults[Object.keys(groupByResults)[0]]})    
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
    if (diff.years > 0) {
      return "year";
    } else if (diff.months > 0) {
      return "month";
    } else if (diff.days > 0) {
      return "day";
    }
}  
function gnGapObj(gap) {
   let arr = [],limit = 40, i = 0
   while (i <= limit) {
        arr.push({name: `${i} - ${i+gap}`, min: i, max: i+gap})
        i+=gap
   } 
   return arr
}