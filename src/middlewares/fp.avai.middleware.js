
import errorMessage from '../controllers/response.message.controller';
import {  selectPatientFP } from '../controllers/patients.controller';
import { MatchTemplate,connectFP } from '../controllers/fingerprint.controller';
export const checkFPAvai = async (req,res,next) =>{
    try {
        const {patient,fp_data} = req.body;
       
        const dec = await new Promise( async (resolve, reject) => {
                let p = await selectPatientFP(patient)
                if (!p) p = {data: 'null'};

                let connection
                try {
                    connection = await connectFP('',callback=>{
                        if (callback.type && callback.type == 'comparison' && callback.success) {
                            resolve(1)
                        }else if (callback.type && callback.type == 'comparison' && !callback.success) {
                            resolve(0)
                        }
                        
                    })
                
                } catch (error) {
                connection = !1
                }
                if (connection) {
                  let v = MatchTemplate(fp_data,p.data)
                  if(!v) resolve(0)
                }else{
                    reject(0)
                }
            });
        if (dec) return res.status(401).send({ message: errorMessage._err_FP_avai, success: false });
        next()    
        
        
      } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
      }
}