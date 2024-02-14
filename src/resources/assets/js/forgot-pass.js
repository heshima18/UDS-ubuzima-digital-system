import { addSpinner, alertMessage, checkEmpty, postschema, removeSpinner, request } from "../../../utils/functions.controller.js"

((ele) =>{
    let f = document.querySelector('form'),inp = f.querySelector('input'),v,e,utp = Array.from(f.querySelectorAll('span.u-selectors'))
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
    f.onsubmit = async function (event) {
        event.preventDefault();
        v = checkEmpty(inp)
        if(!utp.find(tp=>{return tp.classList.contains('active')})){
            utp.forEach(type=>{
                type.classList.replace('b-1-s-gray','b-1-s-red')
            })
            return
        }
        if (v) {
            
            e = inp.value.trim();
            addSpinner(this.querySelector('button'))
            postschema.body = JSON.stringify({
                identifier: e,
                uType: utp.find(tp=>{return tp.classList.contains('active')}).getAttribute('data-id'),
            })
            let response = await request('gntrrstlnk',postschema)
            removeSpinner(this.querySelector('button'))
            if (response.success) {
                f.reset()
            }
            alertMessage(response.message)

        }
    }

})()