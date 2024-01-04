import { alertMessage, postschema, request, chSession, checkEmpty } from "../../../utils/functions.controller.js";
chSession();
const form = document.querySelector("form#form");
const submitButton = form.querySelector('button[type="submit"]')
const inputs = Array.from(form.querySelectorAll('input'))
let show = form.querySelector('i.bx');
show.addEventListener('click', e=>{
    show.classList.toggle('bx-hide')
    show.classList.toggle('bx-show')
    let password = inputs.find((inp) => {return inp.name == 'password'})
   if (password.type == 'password') {
    password.type = 'text'
   }else{
    password.type = 'password'
   }
})
form.addEventListener('submit', async event=>{
    event.preventDefault()
    let inputs = form.querySelectorAll('input')
    let o = {}
    let v,c
    c = 1
    for (const input of inputs) {
        v = checkEmpty(input)
        if (!v) {
           c = 0 
        }
        Object.assign(o,{[input.name]: input.value})
    }
    if (c) {
        submitButton.setAttribute('disabled',true)
        submitButton.innerText = 'signing in...'
        postschema.body = JSON.stringify(o)    
        let res = await request('user-login',postschema)
        submitButton.removeAttribute('disabled')
        submitButton.innerText = 'signin'
        if (res.success) {
            for (const input of inputs) {
                if(input.getAttribute('data-field-name') == 'username'){
                    localStorage.setItem('userid',input.value.trim())
                }
            }
            window.location.href = '../auth/'
        }else{
            alertMessage(res.message)
        }
    }
})