
import { getPath } from "../../../utils/functions.controller.js";
const path =  getPath()[0]
let gsd;
if (path == 'hc_provider') {
    const file = await import('./hc_provider.js')
    gsd = file.gsd
}else if (path == 'laboratory_scientist') {
    const file = await import('./laboratory.js')
    gsd = file.gsd
}else if (path == 'receptionist') {
    const file = await import('./receptionist.js')
    gsd = file.gsd
}
export  {gsd}