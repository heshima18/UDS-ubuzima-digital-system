import { alertMessage, getdata, getschema, postschema, request } from "../../../utils/functions.controller.js";

let form = document.querySelector('form#twoStepsForm')
let codein = Array.from(form.querySelectorAll('input.code-hol'))
let subbut = form.querySelector('button[type="submit"]')
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
        localStorage.setItem('token',res.message)

        let z = await request(`authenticateToken/${res.message}`,getschema)
        if (z.success) {
            z = z.token
            if (z.role == 'admin') {
                window.location.href = '../employees/'
            }
        }
    }else{
        alertMessage(res.message)
    }
    console.log(val)
})