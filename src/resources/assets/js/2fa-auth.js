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
            _2FA_code: val
        }
        )
        let res = await request('verify',postschema)
        subbut.removeAttribute('disabled')
    subbut.innerText = 'Verify'

    if (res.success) {
        localStorage.removeItem('userid') 
        let z = await request(`authenticateToken/${res.message}`,getschema)
        if (z.success) {
            z = z.token
            localStorage.setItem('token',res.message)
            if (z.role == 'Admin') {
                window.location.href = '../admin/employees/'
            }
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