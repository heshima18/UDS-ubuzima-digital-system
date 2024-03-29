import { alertMessage, getdata, getschema, postschema, request } from "../../../utils/functions.controller.js";

let form = document.querySelector('form#twoStepsForm')
let codein = Array.from(form.querySelectorAll('input.code-hol'))
let subbut = form.querySelector('button[type="submit"]');
const resend_link = form.querySelector('a#resend-link');
for (const code_field of codein) {
    code_field.addEventListener('keyup',e=>{
        e.preventDefault();
        if (code_field.value.trim().length == 1) {
            if (codein[codein.indexOf(code_field)+1]) {
                codein[codein.indexOf(code_field)+1].focus()
            }
        }else if (code_field.value.trim().length != 1) {
            if (codein[codein.indexOf(code_field)-1]) {
                codein[codein.indexOf(code_field)-1].focus()
            }
        }
    })
    // code_field.addEventListener('keydown',e=>{
    //     e.preventDefault();
    //     console.log(code_field.value)
    //     if (code_field.value.trim().length == 1) {
    //         if (codein[codein.indexOf(code_field)+1]) {
    //             codein[codein.indexOf(code_field)+1].focus()
    //         }
    //     }else if (code_field.value.trim().length != 1) {
    //         if (codein[codein.indexOf(code_field)-1]) {
    //             codein[codein.indexOf(code_field)-1].focus()
    //         }
    //     }
    // })
}
if (!getdata('userid')) {
    window.location.href = '../login/'

}
form.addEventListener('submit', async e=>{
    e.preventDefault();
    var val = ''
    for (const code_field of codein) {
        if (code_field.value.trim().length == 0) return 0
        val += code_field.value.trim()
    }
    subbut.setAttribute('disabled',true)
    subbut.innerText = 'Authenticating...'
    if (!getdata('userid')) {
             window.location.href = '../login/'
        
    }
    postschema.body = JSON.stringify(
        {
            email:getdata('userid'),
            uType:getdata('uType'),
            _2FA_code: val
        }
        )
        let res = await request('verify',postschema)
        subbut.removeAttribute('disabled')
    subbut.innerText = 'Verify'

    if (res.success) {
        let z = await request(`authenticateToken/${res.message}`,getschema)
        if (z.success) {
            localStorage.removeItem('userid')
            localStorage.setItem('token',res.message)
            z = z.message
            if (z.role == 'admin') {
                window.location.href = '../admin/home/'
            }else if (z.role == 'patient') {
                window.location.href = '../patient/home/'
                
            }else if (z.role == 'householder') {
                window.location.href = '../householder/home/'
                
            }else if (z.role == 'hc_provider') {
                window.location.href = '../hc_provider/home/'
                
            }else if (z.role == 'pharmacist') {
                window.location.href = '../pharmacist/home/'
                
            }else if (z.role == 'cashier') {
                window.location.href = '../cashier/home/'
                
            }else if (z.role == 'receptionist') {
                window.location.href = '../receptionist/home/'
                
            }else if (z.role == 'director_general') {
                window.location.href = '../director_general/home/'
                
            }else if (z.role == 'dof') {
                window.location.href = '../dof/home/'
                
            }else if (z.role == 'mohs') {
                window.location.href = '../mohs/home/'
                
            }else if (z.role == 'Human resource manager') {
                window.location.href = '../hrm/home/'
                
            }else if (z.role == 'laboratory_scientist') {
                window.location.href = '../laboratory_scientist/home/'
                
            }else if (z.role == 'insurance_manager') {
                window.location.href = '../insurance_manager/home/'
                
            }
        }else{
            console.log()
        }
    }else{
        alertMessage(res.message)
    }
   
})
resend_link.addEventListener('click',async e =>{
    e.preventDefault();
    console.log('ddd')
    if (!getdata('userid')) {
        return alertMessage('user not found')
    }
    subbut.setAttribute('disabled',true)
    subbut.innerText = 'Sending Code'
    let userid  = getdata('userid')
    postschema.body = JSON.stringify(
        {
            username: userid
        }
        )
    let res = await request('resend-2FA',postschema)
    subbut.removeAttribute('disabled')
    subbut.innerText = 'Verify'
    alertMessage(res.message)
})