import { alertMessage, getdata, getschema, postschema, request,initializeCleave, checkEmpty, showRecs, getchips } from "../../../utils/functions.controller.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m
u = getdata('token')
if(!u){
    window.location.href = '../../login'
}
(async function () {
    postschema.body = JSON.stringify({token : getdata('token')})
    m = await request('getnmbrs',postschema)
    try {
        if (m.success) {
            m = m.message
            let nmhols  = Array.from(document.querySelectorAll('[data-role="num_hol"]'))
            Object.keys(m).forEach( (number)=>{
                nmhols.map(function (hol) {
                    if (hol.id == number) {
                       hol.innerText = m[number]
                    }
                })
            })
        }else{
            alertMessage(m.message)
        }
    } catch (error) {
      console.log(error)  
    }
   
})()