import { addSpinner, alertMessage, checkEmpty, getPath, postschema, removeSpinner, request, setErrorFor } from "../../../utils/functions.controller.js";

((ele) =>{
    let shbuts = Array.from(document.querySelectorAll('span.showP')),form = document.querySelector('form')
    let f = document.querySelector('form'),pass = f.querySelector('input[name="password"]'),conf = f.querySelector('input[name="confirm-password"]'),v,e;
    f.onsubmit = async function (event) {
        event.preventDefault();
        v = checkEmpty(pass)
        e = checkEmpty(conf)
        if (v && e) {
            if (pass.value != conf.value) {
                return setErrorFor(pass,"passwords do not match")
            }
            addSpinner(this.querySelector('button'))
            postschema.body = JSON.stringify({
                password : pass.value,
                token: getPath(1)
            })
            let response = await request('rstpsswrd',postschema)
            removeSpinner(this.querySelector('button'))
            alertMessage(response.message)
        }
    }
    shbuts.forEach(button=>{
        button.onclick = function (event) {
            event.preventDefault();
            if (this.parentNode.querySelector('input').type == 'password') {
                this.querySelector('i').classList.replace('bx-show','bx-hide')
                this.parentNode.querySelector('input').type = 'text'
            }else{
                this.querySelector('i').classList.replace('bx-hide','bx-show')
                this.parentNode.querySelector('input').type = 'password'
            }
        }
    })

})()
