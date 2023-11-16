import query from './query.controller'
import errorMessage from './response.message.controller'
import id from "./randomInt.generator.controller";
const getAdminNmbrs = async (req,res)=>{
  let nmbrs = await query(`select
   (SELECT COUNT(patients.id) FROM patients) as patients,
   (SELECT COUNT(users.id) FROM users) as users,
   (SELECT COUNT(medicines.id) FROM medicines) as medicines,
   (SELECT COUNT(tests.id) FROM tests) as tests,
   (SELECT COUNT(equipments.id) FROM equipments) as equipments,
   (SELECT COUNT(operations.id) FROM operations) as operations,
   (SELECT COUNT(services.id) FROM services) as services,
   (SELECT COUNT(assurances.id) FROM assurances) as assurances,
   (SELECT COUNT(provinces.id) FROM provinces) as provinces, 
   (SELECT COUNT(districts.id) FROM districts) as districts,
   (SELECT COUNT(sectors.id) FROM sectors) as sectors,
   (SELECT COUNT(cells.id) FROM cells) as cells  
  `,[])
  if (!nmbrs) {
    res.send({success:false, message: errorMessage.is_error})
    return
  }
  res.send({success: true, message: nmbrs[0]})
}
export default getAdminNmbrs