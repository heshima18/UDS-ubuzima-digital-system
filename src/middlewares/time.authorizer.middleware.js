import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";
export const CheckAppointmentTimer = async (req, res, next) => {
    try {
      let {time,token,status} = req.body
      if (status == 'declined') {
        return next()
      }
      let hc_provider = authenticateToken(token);
      hc_provider = hc_provider.token.id
      if (!hc_provider) return res.status(404).send({ message: errorMessage._err_hcp_404, success: false });
      let q = await query(`select time from appointments where hc_provider = ? and status != ? and status != ? order by time desc limit 0,1`,[hc_provider,'outdated','declined'])
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if(q.length == 0){
        next();
        return
      }  
      [q]=q
      q.time =  new Date(q.time);
      time =  new Date(time);
      console.log((q.time >= time),q.time , time)
      if (time <= q.time) return res.send({ message: errorMessage._err_hcp_unav, success: false });
      if (time.getHours() >= 18 || time.getHours() <= 8) return res.send({ message: errorMessage._err_hcp_unav, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
};
export const getAppointmentETA = async (req, res) => {
  try {
    let nowHours,nowMinutes,nowSeconds,nowMonth,nowDay,nowYear
    let {time,token} = req.body
    let hc_provider = authenticateToken(token);
    hc_provider = hc_provider.token.id
    if (!hc_provider) return res.status(404).send({ message: errorMessage._err_hcp_404, success: false });
    let q = await query(`select time from appointments where hc_provider = ? and status != ? and status != ? and status != ? order by time desc limit 0,1`,[hc_provider,'outdated','declined',`completeted`])
    if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
    if(q.length == 0){
      time = new Date();
      nowYear = time.getFullYear();
      nowMonth = time.getMoth() + 1;
      nowDay = time.getDate();
      nowHours = time.getHours();
      nowMinutes = time.getMinutes();
      nowSeconds = time.getSeconds();
      time = new Date(nowYear,nowMonth,nowDay,nowHours,nowMinutes,nowSeconds)
      time = calculateMissingHours(time);
      time.setMinutes(time.getMinutes() + 50)
      return res.send({success: true, message: time })
    }  
    [q]=q
    q.time =  new Date(q.time);
    // q.time.setMinutes(q.time.getMinutes() + 50);
    time =  new Date();
    nowYear = time.getFullYear();
    nowMonth = time.getMonth() + 1;
    nowDay = time.getDate();
    nowHours = time.getHours();
    nowMinutes = time.getMinutes();
    nowSeconds = time.getSeconds();
    time = new Date(nowYear,nowMonth,nowDay,nowHours,nowMinutes,nowSeconds)
    // time = time.setMinutes(time.getMinutes() + 120);
    console.log((q.time >= time))
    if (time <= q.time){
      console.log(q.time)
      q.time.setMinutes(q.time.getMinutes() + 50);
      console.log(q.time)
      q.time =  calculateMissingHours(q.time);
      return res.send({ message: q.time, success: true })
    };
    time = calculateMissingHours(time)
    time.setMinutes(time.getMinutes() + 50)
    if (time.getHours() >= 18 || time.getHours() <= 8) return res.send({ message: errorMessage._err_hcp_unav, success: false });
    return res.send({ message: time, success: true })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: errorMessage.is_error, success: false });
  }
};
function calculateMissingHours(inputTime) {
  // Define the target times (8:00 AM and 18:00)
  const currentTime = new Date(inputTime);
  const currentHour = currentTime.getHours();

  // Check if the current time is within the range (18:00 to 8:00)
  if (currentHour >= 18) {
    const missingHours = 8 + (24 - currentHour) + 1
    currentTime.setHours(currentTime.getHours() + missingHours)
    return currentTime; // Return the input time if it's outside the range
  }else if ( currentHour < 8) {
    const missingHours = 8 - currentHour
    currentTime.setHours(currentTime.getHours() + missingHours)
    return currentTime;
  }
  return currentTime;
}
