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
let utp = Array.from(form.querySelectorAll('span.u-selectors'))
    utp.forEach(type=>{
        type.onclick = function (event) {
            event.preventDefault();
            this.classList.replace('b-1-s-gray', 'b-1-s-theme')
            this.classList.replace('b-1-s-red', 'b-1-s-theme')
            this.classList.add('active')
            utp.map(d=>{
                if (d != this) {
                    d.classList.replace('b-1-s-theme','b-1-s-gray')
                    d.classList.replace('b-1-s-red','b-1-s-gray')
                    d.classList.remove('active')
                }
            })
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
    if(!utp.find(tp=>{return tp.classList.contains('active')})){
        utp.forEach(type=>{
            type.classList.replace('b-1-s-gray','b-1-s-red')
        })
        return
    }
    if (c) {
        submitButton.setAttribute('disabled',true)
        submitButton.innerText = 'signing in...'
        Object.assign(o,{uType: utp.find(tp=>{return tp.classList.contains('active')}).getAttribute('data-id')})
        postschema.body = JSON.stringify(o)    
        let res = await request('user-login',postschema)
        submitButton.removeAttribute('disabled')
        submitButton.innerText = 'signin'
        if (res.success) {
            for (const input of inputs) {
                if(input.getAttribute('data-field-name') == 'username'){
                    localStorage.setItem('userid',input.value.trim())
                    localStorage.setItem('uType',utp.find(tp=>{return tp.classList.contains('active')}).getAttribute('data-id'))
                }
            }
            window.location.href = '../auth/'
        }else{
            alertMessage(res.message)
        }
    }
})