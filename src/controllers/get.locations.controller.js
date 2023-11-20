import query from './query.controller'
import errorMessage from './response.message.controller'
const getMap = async (req,res)=>{
  try {
    let provinces = await query('SELECT name,id from provinces')
    let districts = await query('SELECT name,id,province from districts')
    let sectors = await query('SELECT name,id,district from sectors')
    let cells = await query('SELECT name,id,sector from cells')
    if(!provinces || !districts || !sectors || !cells) return res.status(500).send({success: false, message: errorMessage.is_error})
    let Obj = []
    provinces.map(function (province) {
        Obj.push({provinces: [{id: province.id,name: province.name, districts: []}]})
        
    })
    for (const province of Obj) {
        for (const district of  districts) {
            if (province.provinces[0].id == district.province) {
                Obj[Obj.indexOf(province)].provinces[0].districts.push({id: district.id, name: district.name, sectors: []})
              }
        }
    }
    for (const province of Obj) {
        for (const district of  province.provinces[0].districts) {
            for (const sector of sectors) {
                if (sector.district == district.id) {
                    Obj[Obj.indexOf(province)].provinces[0].districts[Obj[Obj.indexOf(province)].provinces[0].districts.indexOf(district)].sectors.push({id: sector.id, name: sector.name, cells: []})
                }
                
            }
        }
    }
    for (const province of Obj) {
        for (const district of  province.provinces[0].districts) {
            let distinex = province.provinces[0].districts.indexOf(district)
            for (const sector of district.sectors) {
                let sectIndex = province.provinces[0].districts[distinex].sectors.indexOf(sector)
                for (const cell of cells) {
                    if (cell.sector == sector.id) {
                        Obj[Obj.indexOf(province)].provinces[0].districts[distinex].sectors[sectIndex].cells.push({id: cell.id, name: cell.name})
                    }
                    
                }
                
            }
        }
    } 
      res.send({success: true, message: Obj})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({success:false, message: errorMessage.is_error})
  }
}
export default getMap