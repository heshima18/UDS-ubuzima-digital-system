import query from "../controllers/query.controller";
import errorMessage from "../controllers/response.message.controller";
export const CheckAppointmentTimer = async (req, res, next) => {
    try {
      let {time,hc_provider} = req.body
      if (!hc_provider) return res.status(404).send({ message: errorMessage._err_hcp_404, success: false });
      let q = await query(`select time from appointments where hc_provider = ? and status != ? and status != ? order by time desc limit 0,1`,[hc_provider,'outdated','declined'])
      if (!q) return res.status(500).send({ message: errorMessage.is_error, success: false });
      if(q.length == 0){
        next();
        return
      }  
      [q]=q
      q.time =  new Date(q.time);
      q.time.setMinutes(q.time.getMinutes() + 45);
      time =  new Date(time);
      q.time.setHours(q.time.getHours() + 2);
      time.setHours(time.getHours() + 2);
      console.log((q.time >= time),q.time , time)
      if (time <= q.time) return res.send({ message: errorMessage._err_hcp_unav, success: false });
      if (time.getHours() >= 18 || time.getHours() <= 8) return res.send({ message: errorMessage._err_hcp_unav, success: false });
      next();
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: errorMessage.is_error, success: false });
    }
  };