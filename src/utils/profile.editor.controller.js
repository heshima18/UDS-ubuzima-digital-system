import { addSpinner, addshade, alertMessage, checkEmpty, deletechild, getdata, initializeCleave, postschema, promptPassword, removeSpinner, request, setErrorFor, setSuccessFor } from "./functions.controller.js"

export function shedtpopup(type,info,isP) {
    let s = addshade(),
	a = document.createElement('div'),f
	s.appendChild(a)
    a.className = "w-500p h-a p-20p bsbb bc-white cntr zi-10000 br-10p b-mgc-resp card-1" 
    a.innerHTML = `<div class="head w-100 h-40p p-5p bsbb bb-1-s-dg">
                        <span class="fs-18p black capitalize igrid center h-100">edit profile info</span>
                    </div>
                    <div class="body w-100 h-a p-5p grid mt-10p">
                        <form method="post" id="edit-profile-form" name="edit-profile-form">
                        ${(type == 'email') ? `
                        <div class="mb-3 col-12">
                            <label class="form-label" for="email">New Email</label>
                            <input class="form-control main-input" type="text" name="email" id="email" placeholder="email" value="${info[type]}">
                            <small class="hidden red"></small>
                        </div>
                        ` : (type == 'username') ? `
                        <div class="mb-3 col-12">
                            <label class="form-label" for="username">New Username</label>
                            <input class="form-control main-input" type="text" name="username" id="username" placeholder="username" value="${info[type]}">
                            <small class="hidden red"></small>
                        </div>
                        ` : (type == 'phone') ? `
                        <div class="mb-3 col-12">
                            <label class="form-label" for="phone">New Phone Number</label>
                            <input class="form-control main-input" type="text" name="phone" id="phone" placeholder="phone" value="${info[type]}">
                            <small class="hidden red"></small>
                        </div>
                        `: ''}
                        <div class="mb-3 col-12">
                            <button class=" btn btn-primary" type="submit">proceed</button>
                        </div>
                        </form>
                    </div>`
    f = a.querySelector('form#edit-profile-form')
    let phone = f.querySelector('#phone')
    if (phone) {
        initializeCleave(phone,null)
    }
    let input = f.querySelector('input.main-input')
    input.select()
    input.focus()
    f.addEventListener('submit',async (e)=>{
        e.preventDefault()
        let dec = checkEmpty(input)
        if (dec) {

            let value = (type == "phone") ? input.value.replace(/ /g, "") : input.value,
            password = await promptPassword()
            postschema.body = JSON.stringify({
                token: getdata('token'),
                type,
                value,
                password
            })
            addSpinner(f.querySelector('button'))
            let response
            if (!isP) {
                response = await request('edit-profile',postschema)
            }else{
                response = await request('edit-patient-profile',postschema)
            }
            removeSpinner(f.querySelector('button'))
            if (response.success) {
                deletechild(s,s.parentElement)
            }
            alertMessage(response.message)
        }
        
    })
    
}