import { DateTime } from "luxon";
import query from "../controllers/query.controller";

export async function weeklyProcess() {
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        // let time = now.toFormat('yyyy-MM-dd HH:mm:ss')
        let lastWeek = now.minus({days: 1})
    
        lastWeek = lastWeek.toFormat('yyyy-MM-dd')
        let delSeenMssgs = await query(`delete from messages where (status = ? OR status = ?) AND DATE(dateadded) <= ? AND type!= ?`,['seen','expired', lastWeek,'p_message'])
        if (delSeenMssgs) {
            console.log(`process started`)
        }
        
    } catch (error) {
       console.log(error) 
    }
    

}
export async function hourlyProcess() {
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        // let time = now.toFormat('yyyy-MM-dd HH:mm:ss')
        let lastHour = now.minus({minutes: 60})
    
        lastHour = lastHour.toFormat('yyyy-MM-dd')
        let delExpiredMssgs = await query(`delete from messages where status = ? and DATE(dateadded) <= ?`,['expired', lastHour])
        if (delExpiredMssgs) {
            console.log(`process started`)
        }
        
    } catch (error) {
       console.log(error) 
    }
    

}
export async function DailyProcess() {
    try {
        const leTime = DateTime.now();
        let now = leTime.setZone('Africa/Kigali');
        let today = now.toFormat('yyyy-MM-dd HH:mm:ss'),todayDate = now.toFormat('yyyy-MM-dd'),todayTime = now.toFormat('HH:mm:ss')
        let yesterday = now.minus({days: 1})
    
        yesterday = yesterday.toFormat('yyyy-MM-dd')
        let delExpiredMssgs = await query(`delete from messages where type = ? and DATE(dateadded) <= ?`,['info_access_req', yesterday])
        let expirateAppointMents = await query(`update appointments set status = ? where DATE(time) <= ? AND TIME(time) <= ? AND status != ?`,['outdated', todayDate,todayTime,'outdated'])
        if (delExpiredMssgs) {
            console.log(`process started`)
        }
        
    } catch (error) {
       console.log(error) 
    }
    

}
setTimeout(()=>{
    weeklyProcess();
    DailyProcess()

},10000)

const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
const oneHourInMilliseconds = 60 * 60 * 1000;

// Set up a setInterval to run your function at the end of each week
setInterval( async ()=>{
    await weeklyProcess()
}, oneWeekInMilliseconds);

setInterval( async ()=>{
    await hourlyProcess()
}, oneHourInMilliseconds);
setInterval( async ()=>{
    await DailyProcess()
}, oneDayInMilliseconds);
