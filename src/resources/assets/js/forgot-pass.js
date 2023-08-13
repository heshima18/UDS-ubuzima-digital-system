import { alertMessage, getdata, getschema, postschema, request } from "../../../utils/functions.controller.js";

let form = document.querySelector('form#formAuthentication')
let user = form.querySelector('input#email')
let subbut = form.querySelector('button[type="submit"]')
form.addEventListener('submit',async e=>{
    e.preventDefault();
    subbut.setAttribute('disabled',true)
    subbut.innerText = 'Sending Link...'
    console.log(user.value.trim())
    postschema.body = JSON.stringify(
        {
            email: user
        }
        )
        let res = await request('verify',postschema)
        subbut.removeAttribute('disabled')
    subbut.innerText = 'Send Link'

    if (res.success) {
        alertMessage(res.message)
    }else{
        alertMessage(res.message)
    }

})