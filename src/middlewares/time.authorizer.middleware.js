import { DateTime } from "luxon";
import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";
export const CheckAppointmentTimer = async (req, res, next) => {
    try {
      let {time,token,status} = req.body
      const leTime = DateTime.now();
      let now = leTime.setZone('Africa/Kigali');
      now = now.toFormat('yyyy-MM-dd HH:mm:ss')
      if (status == 'declined') {
        return next()
      }
      let hc_provider = authenticateToken(token);
      hc_provider = hc_provider.token.id
      if (!hc_provider) return res.status(404).send({ message: errorMessage._err_hcp_404, success: false });
      let q = await query(`select time from appointments where hc_provider = ? and status != ? and status != ? order by time desc limit 0,1`,[hc_provider,'outdated','declined'])
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if(q.length == 0){
        if (new Date(time) <= new Date(now)) {
          return res.send({ message: errorMessage._err_hcp_unav, success: false });
        }
        next();
        return
      }  
      time =  new Date(time);
      for (const dtime of q) {
        let ctime =  new Date(dtime.time);
        if (ctime == time) {
          return res.send({ message: errorMessage._err_hcp_unav, success: false });
        }
        
      }
      if (time <= new Date(now)) return res.send({ message: errorMessage._err_hcp_unav, success: false });
      if (time.getHours() >= 18 || time.getHours() <= 8) return res.send({ message: errorMessage._err_hcp_unav, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
};
export const getAppointmentETA = async (req, res) => {
  try {
    const leTime = DateTime.now();
    let now = leTime.setZone('Africa/Kigali');
    let {time,token} = req.body
    if (!time) {
      time = now
    }
    let hc_provider = authenticateToken(token);
    hc_provider = hc_provider.token.id
    if (!hc_provider) return res.status(404).send({ message: errorMessage._err_hcp_404, success: false });
    let q = await query(`select time from appointments where hc_provider = ? and status != ? and status != ? and status != ? order by time desc limit 0,1`,[hc_provider,'outdated','declined',`completeted`])
    if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
    if(q.length == 0){
      time = now
      time = calculateMissingHours(time);
      time = time.plus({ minutes: 45 });
      time = time.toFormat('yyyy-MM-dd HH:mm:ss')
      return res.send({success: true, message: time.toString()})
    }  
    [q]=q
    q.time = DateTime.fromISO(q.time)
    if (now.toFormat('yyyy-MM-dd HH:mm:ss') <= q.time.toFormat('yyyy-MM-dd HH:mm:ss')){
      q.time = q.time.plus({minutes : 50});
      q.time =  calculateMissingHours(q.time);
      q.time = q.time.toFormat('yyyy-MM-dd HH:mm:ss')
      return res.send({ message: q.time.toString(), success: true,time:'dd' })
    };
    // time = calculateMissingHours(time)
    // time.setMinutes(time.getMinutes() + 50)
    // if (time.getHours() >= 18 || time.getHours() <= 8) return res.send({ message: errorMessage._err_hcp_unav, success: false });
    time = time.plus({ minutes: 45 });
    time = time.toFormat('yyyy-MM-dd HH:mm:ss')
    return res.send({ message: time.toString(), success: true })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success: false });
  }
};
function calculateMissingHours(inputTime) {
  // Define the target times (8:00 AM and 18:00)
  let currentTime = inputTime
  const currentHour = currentTime.hour;
  // Check if the current time is within the range (18:00 to 8:00)
  if (currentHour >= 18) {
    const missingHours = 8 + (24 - currentHour)
    currentTime = currentTime.plus({hours: missingHours})
    return currentTime; // Return the input time if it's outside the range
  }else if ( currentHour < 8) {
    const missingHours = 8 - currentHour
    currentTime = currentTime.plus({hours: missingHours})
    return currentTime;
  }
  return currentTime;
}
