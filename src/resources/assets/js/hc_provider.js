import { alertMessage, getdata, getschema, postschema, request,deletechild, checkEmpty, showRecs, getchips,getPath, addUprofile,addsCard,cpgcntn, geturl,sessiondata,addChip, showAvaiAssurances, adcm, addshade } from "../../../utils/functions.controller.js";
import {pushNotifs, userinfo} from "./nav.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z
(async function () {
    z = userinfo
    let token = getdata('token')
    if (!token) {
        window.location.href = '../../login/'
    }
    if (!z.success) {
        localStorage.removeItem('token')
        return alertMessage(z.message)
    }
    if (z.success) {
        z = z.token
        try {
            const socket = io(geturl(),{ query : { id: z.id} });
            socket.on('connect', () => {
            console.log('Connected to the server');
            });
            
            socket.on('message', (message) => {
                pushNotifs(message);
                addsCard(message.title,true)

            });
            socket.on('selecthp', (message)=>{
                var div = document.createElement('div')
                document.body.appendChild(div)
                for (const hp of message) {
                    div.innerHTML += `<div id="${hp.id}" class="verdana hover p-5p">${hp.name}</div>`
                }
                let dvs = div.querySelectorAll('div')
                dvs.forEach(button=>{
                    button.addEventListener('click',e=>{
                        e.preventDefault()
                        socket.emit('hpchoosen',{hp: button.id, token: localStorage.getItem('token')})
                    })
                })
            })
            socket.on('changetoken',(token)=>{
                window.alert('token changed')
                localStorage.setItem('token',token)
                window.location.href = window.location.href
            })
            socket.emit('messageToId',{recipientId: z.id, message: 'wassup'})
            if (typeof(z.hospital) != 'string' && typeof(z.hospital) == 'object' && z.hospital.length > 0) {
                socket.emit('getpsforselection',z.hospital)
            }
        } catch (error) {
            console.log(error)
        }
    }
    postschema.body = JSON.stringify({token})
    let users = await request('get-hp-employees',postschema)
    q = await request('get-inventory',postschema)
    f = await request('get-tests',postschema)
    l = await request('get-equipments',postschema)
    k = await request('get-services',postschema)
    j = await request('get-operations',postschema)
    if (!q.success || !f.success || !l.success || !k.success || !j.success || !users.success) {
        return alertMessage(q.message)
    }
    let extra = {users: users.message, tests: f.message, medicines : q.message.medicines, equipments: l.message, services : k.message, operations : j.message}
    a = getPath(1)
    c = Array.from(document.querySelectorAll('span.cpcards'))
    p = Array.from(document.querySelectorAll('div.pagecontentsection'))
    if(a){
        p.forEach(target=>{
            if (a == target.id) {
                t = p.indexOf(target)
                c.forEach((cp)=>{
                    cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
                })
                c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
                cpgcntn(t,p,extra)
                gsd(target)
                return 0
            }
        })
    }else{
        window.history.pushState('','','./home')
        cpgcntn(0,p,extra)

    }
    window.onpopstate = function () {
        a = getPath(1)
        if(a){
            p.forEach(target=>{
                if (a == target.id) {
                    t = p.indexOf(target)
                    c.forEach((cp)=>{
                        cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
                    })
                    c[t].classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
                    cpgcntn(t,p)
                    return 0
                }
            })
        }else{
            window.history.pushState('','','./home')
            cpgcntn(0,p)
    
        }
    }
    c.forEach((cudstp)=>{
        cudstp.addEventListener('click',()=>{
            c.forEach((cp)=>{
                cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
            })
            cudstp.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
            window.history.pushState('','',`./${cudstp.getAttribute('data-item-type')}`)
            cpgcntn(c.indexOf(cudstp),p,extra)
            gsd(p.find(function (elem) {
                return elem.id == cudstp.getAttribute('data-item-type')
            }))
        })
    })
    async function gsd(page) {
        try {
            x = page.id
            if (x == 'search-patient') {
            f = page.querySelector('form[name="sp-form"]');
            s = f.querySelector('input[type="text"]')
            setTimeout(e=>{s.focus()},200)
            b = f.querySelector('button[type="submit"]')
            f.addEventListener('submit',async e=>{
                e.preventDefault();
                if (!s.value) return 0
                b.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span>`
                b.setAttribute('disabled',true)
                r = await request(`patient/${s.value}`,postschema)
                b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                b.removeAttribute('disabled')
                if (!r.success) return alertMessage(r.message)
                addUprofile(r.message);
          
            })
            }else if (x == 'my-account') {
                n = page.querySelector('span.name')
                z = getdata('userinfo')
                n.textContent = z.Full_name
                i = page.querySelector('span.n-img');
                i.textContent = z.Full_name.substring(0,1)
                let editbuts = Array.from(page.querySelectorAll('span.icon-edit-icon'))
                for (const button of editbuts) {
                    button.addEventListener('click',()=>{
                        l = button.getAttribute('data-target')
                        shedtpopup(l,r);
                    })
                }
          
            }else if (x == 'create-session') {
                try {
                    f = document.querySelector('form#create-session-form')
                    i = Array.from(f.querySelectorAll('.form-control'))
                    let asb = f.querySelector('span#add-symptom');
                    let arb = f.querySelector('span#add-decisions');
                    let extras_input = Array.from(f.querySelectorAll('input.extras'));
                    let op_input = f.querySelector('input[name="operations"]');
                    extras_input.map(function (input) {
                      input.addEventListener('focus', event=>{
                        showRecs(input,extra[input.id],input.id)
                      })
                    })
                    op_input.addEventListener('focus', event=>{
                      showRecs(op_input,extra[op_input.id],op_input.id)
                    
                    })
                    asb.addEventListener('click',e=>{
                      let parent = asb.parentNode
                      let inp = parent.querySelector('input')
                      if (inp.value.trim()) {
                        let chipsHolder = parent.querySelector('div.chipsholder')
                        if (!chipsHolder) {
                          chipsHolder = document.createElement('div');
                          chipsHolder.className = 'chipsholder p-5p bsbb w-100'
                          chipsHolder.title = 'symptoms'
                          parent.insertAdjacentElement('beforeEnd',chipsHolder)
                        }
                        addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder,['id'])
                        inp.value = null
                      }
                    })
                    arb.addEventListener('click',e=>{
                      let parent = arb.parentNode
                      let inp = parent.querySelector('input')
                      if (inp.value.trim()) {
                        let chipsHolder = parent.querySelector('div.chipsholder')
                        if (!chipsHolder) {
                          chipsHolder = document.createElement('div');
                          chipsHolder.className = 'chipsholder p-5p bsbb w-100'
                          chipsHolder.title = 'results'
                          parent.insertAdjacentElement('beforeEnd',chipsHolder)
                        }
                        addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder,['id'])
                        inp.value = null
                      }
                    })
                    n = i.find(function (e) {return e.id == 'patient'})
                    if (sessiondata('pinfo')) {
                      n.value = sessiondata('pinfo').name
                      n.setAttribute('data-id',sessiondata('pinfo').patient)
                    }
                    let val
                    n.addEventListener('focus',()=>{
                        if (sessiondata('pinfo')) {
                            n.value = sessiondata('pinfo').nid
                            n.setAttribute('data-id',sessiondata('pinfo').patient)
                        }
                        val = n.value
                    })
                    n.addEventListener('blur',async ()=>{
                        if (n.value != val) {
                         v = await upPatInfo(n)
                        }
                        if (sessiondata('pinfo')) {
                            n.value = sessiondata('pinfo').name
                            n.setAttribute('data-id',sessiondata('pinfo').patient)
                        }
                    })
                    async function upPatInfo(n) {
                        if (n.value) {
                            n.parentNode.querySelector('span').classList.replace('hidden','center-2')
                            postschema.body = JSON.stringify({token: getdata('token')})
                            const p = await request(`patient/${n.value.trim()}`,postschema)
                            if (!p.success) {
                             sessionStorage.removeItem('pinfo');
                             n.removeAttribute('data-id');
                             return n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                            }
                            n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                            n.value = p.message.Full_name
                            n.setAttribute('data-id',p.message.id)
                            let a = await showAvaiAssurances(p.message.assurances)
                            l = Array.from(a.querySelectorAll('li.assurance'))
                            for (const lis of l) {
                              lis.addEventListener('click',async function(event){
                                  event.preventDefault();
                                  this.classList.add('selected')
                                  let assurance = this.getAttribute('data-id');
                                  if (assurance == "null") {
                                    assurance = null
                                  }
                                  sessionStorage.setItem('pinfo',JSON.stringify({patient:p.message.id,name:p.message.Full_name,assurance,nid:p.message.nid}))
                                  deletechild(a,a.parentNode)
                                  addsCard('Assurance Selected',true)
                                });
                            }
                            
                          }else{
                            n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                          }
                    }
                    let button = f.querySelector('button[type="submit"]')
                    f.addEventListener('submit', async e =>{
                        let a,b,n,u,r;
                        n = '';
                        u = '';
                        b = {}
                        v = 1
                        e.preventDefault();
                        for (const input of i) {
                        a =  checkEmpty(input);
                        if(!a){ 
                            v = 0
                        }
                        if(input.classList.contains('chips-check')){
                            if (input.name == "tests") {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','sample','result'])})
                            }else if (input.classList.contains('extras')) {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','quantity'])})     
                            }else if (input.name == "operations") {
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'),['id','operator'])})
                            }else{
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'))})
                            }
                        }else if (input.classList.contains('bevalue')) {
                            Object.assign(b,{[input.name]: input.getAttribute('data-id')})
                        }else{
                            Object.assign(b,{[input.name]: input.value})
                        }
                        }
                        if (v) {
                            Object.assign(b,{ assurance: sessiondata('pinfo').assurance})
                            Object.assign(b,{ token: getdata('token')})
                            postschema.body = JSON.stringify(b)
                            button.setAttribute('disabled',true)
                            button.textContent = 'recording session info...'
                            r = await request('addsession',postschema);
                            button.removeAttribute('disabled',true)
                            button.textContent = 'create session'
                            alertMessage(r.message)
                        }
                    }) 
                } catch (error) {
                console.log(error)  
                }
            }else if (x == 'view-session') {
              let session = getPath(2)
              if (session) {
                postschema.body = JSON.stringify({token: getdata('token')})
                let sessiondata =  await request(`session/${session}`,postschema)
                if (!sessiondata.success) return alertMessage(sessiondata.message)
                let session_input = page.querySelector('input#session-id');
                session_input.value = session
                sessiondata = sessiondata.message
                Object.assign(sessiondata.payment_info,{total_amount: Number(sessiondata.payment_info.a_amount) + Number(sessiondata.payment_info.p_amount)})
                const dataHolders = Array.from(document.querySelectorAll('span[name="info-hol"]'))
                const loopingDataHolders = Array.from(document.querySelectorAll('ul[name="looping-info"]'))
                for (const element of loopingDataHolders) {
                    let dataToHold = element.getAttribute('data-hold');
                    let dataToShow = sessiondata[dataToHold]
                    for (const data of dataToShow) {
                        Object.assign(data,{total_amount: Number(data.price) * Number(data.quantity)})
                       let clonedNode = element.cloneNode(true);
                       let dataHolders = clonedNode.querySelectorAll('[name="looping-info-hol"]')
                       for (const dataHolder of dataHolders) {
                        if (dataHolder.getAttribute('data-hold').indexOf('price') != -1 || dataHolder.getAttribute('data-hold').indexOf('amount') != -1) {
                            dataHolder.innerText = adcm(data[dataHolder.getAttribute('data-hold')])
                        }else if (dataHolder.getAttribute('data-hold').indexOf('result') != -1) {
                            if (data[dataHolder.getAttribute('data-hold')] == "positive" || data[dataHolder.getAttribute('data-hold')] == "positif") {
                                dataHolder.classList.add('green')
                            }else{
                                dataHolder.classList.add('red')
                            }
                            dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                        }else{
                            dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]
                        }
                       }
                       element.parentNode.appendChild(clonedNode)
                    }
                    element.parentNode.removeChild(element)

                }
                for (const holder of dataHolders) {
                        let objectId = holder.getAttribute('data-hold')
                        if (objectId.indexOf('.') != -1) {
                            objectId = objectId.split('.')
                            if (objectId[1].indexOf('amount') != -1) {
                                holder.innerText = adcm(sessiondata[objectId[0]][objectId[1]])
                            }else{
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                            }
                        }else{
                            if (holder.getAttribute('data-hold').indexOf('status') != -1) {
                                if (sessiondata[holder.getAttribute('data-hold')] == "open") {
                                    holder.classList.replace('btn-label-secondary','btn-label-success')
                                }
                            }
                            holder.innerText = sessiondata[objectId]
                        }
                }
                let Modals = new popups(sessiondata.session_id)
                const dataButtons = Array.from(page.querySelectorAll('span.data-buttons'))
                dataButtons.map(function (button) {
                    button.addEventListener('click', e=>{
                        e.preventDefault();
                        let role = button.getAttribute('data-role');
                        if (role == 'test') {
                            Modals.test(f.message)
                        }else if (role == 'medication') {
                            Modals.medication(q.message)
                        }else if (role == 'equipment') {
                            Modals.equipment(l.message)
                        }else if (role == 'service') {
                            Modals.service(k.message)
                        }else if (role == 'operation') {
                            Modals.operation(j.message)
                        }else if (role == 'comment') {
                            Modals.comment()
                        }
                    })
                })

              }
            }
            
          } catch (error) {
            console.log(error)
          }
    }
})();
class popups{
    constructor(sessionData){
        this.session = sessionData
    }
    test(data){
        let testsP = addshade();
        a = document.createElement('div');
        testsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-17p dgray capitalize igrid h-100 verdana card-title">add a test to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">test taken</label>
                                    <input type="text" class="form-control bevalue" id="test" placeholder="Demo test" name="test">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="sample" class="form-label">sample taken</label>
                                    <input type="text" class="form-control" id="sample" placeholder="Demo sample" name="sample">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb mb-5p p-r">
                                    <label for="result" class="form-label">results found</label>
                                    <input type="text" class="form-control" id="result" placeholder="Demo results" name="result">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 my-15p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                    <button type="button" class="btn btn-label-primary mx-10p capitalize bfull-resp bm-a-resp bmy-10p-resp">Request for tesing</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))

        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
        
        form.addEventListener('submit', event=>{
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                console.log(values)
            }
        })
    }
    medication(data){
        data = data.medicines
        let medicinesP = addshade();
        a = document.createElement('div');
        medicinesP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-17p dgray capitalize igrid h-100 verdana card-title">add a medication to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="medicine" class="form-label">medication</label>
                                    <input type="text" class="form-control bevalue" id="medicine" placeholder="Demo medicine" name="medicine">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="Demo quantity" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-42p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 my-15p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-id'));
                    }, 200);
                });
        let datauint = data.find(function (obj) {
            return obj.id = val
        })
        unit.innerText = datauint.unit
       })
        form.addEventListener('submit', event=>{
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                console.log(values)
            }
        })
    }
    operation(data){
        let operationsP = addshade();
        a = document.createElement('div');
        operationsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-17p dgray capitalize igrid h-100 verdana card-title">add an operation to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">operation name</label>
                                    <input type="text" class="form-control bevalue" id="operation" placeholder="Demo operation" name="operation">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 my-15p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                    <button type="button" class="btn btn-label-primary mx-10p capitalize bfull-resp bm-a-resp bmy-10p-resp">Request for tesing</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))

        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
        
        form.addEventListener('submit', event=>{
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                console.log(values)
            }
        })
    }
    service(data){
        let servicesP = addshade();
        a = document.createElement('div');
        servicesP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-17p dgray capitalize igrid h-100 verdana card-title">add a service to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="add-service-info-form" name="add-service-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="service" class="form-label">service name</label>
                                    <input type="text" class="form-control bevalue" id="service" placeholder="Demo service" name="service">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="Demo quantity" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-42p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 my-15p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-id'));
                    }, 200);
                });
        let datauint = data.find(function (obj) {
            return obj.id = val
        })
        unit.innerText = datauint.unit
       })
        form.addEventListener('submit', event=>{
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                console.log(values)
            }
        })
    }
    equipment(data){
        let equipmentsP = addshade();
        a = document.createElement('div');
        equipmentsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-17p dgray capitalize igrid h-100 verdana card-title">add as equipment to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="equipment-info-form" name="equipment-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="service" class="form-label">service name</label>
                                    <input type="text" class="form-control bevalue" id="service" placeholder="Demo service" name="service">
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="quantity" class="form-label">quantity</label>
                                    <input type="number" class="form-control" id="quantity" placeholder="Demo quantity" name="quantity">
                                    <span class="p-a t-0 t-0 mx-20p r-0 mt-42p capitalize" name="unit-hol"></span>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 my-15p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('input'))
        let extra_input = inputs.find(function (ins) {return ins.classList.contains('bevalue') })
        extra_input.addEventListener('focus', (event)=>{
            showRecs(extra_input,data,extra_input.id)
        })
       extra_input.addEventListener('blur',async ()=>{
        let unit = form.querySelector('span[name="unit-hol"]')
        let val =  await new Promise((resolve, reject) => {
                    setTimeout(() => {
                    resolve(extra_input.getAttribute('data-id'));
                    }, 200);
                });
        let datauint = data.find(function (obj) {
            return obj.id = val
        })
        unit.innerText = datauint.unit
       })
        form.addEventListener('submit', event=>{
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                console.log(values)
            }
        })
    }
    comment(){
        let commentsP = addshade();
        a = document.createElement('div');
        commentsP.appendChild(a)
        a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
        a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                            <span class="fs-17p dgray capitalize igrid h-100 verdana card-title">add an operation to session</span>
                        </div>
                        <div class="body w-100 h-a p-5p grid">
                            <form method="post" id="req-test-info-form" name="req-test-info-form">
                                <div class="col-md-12 px-10p py-6p bsbb p-r">
                                    <label for="test" class="form-label">comment</label>
                                    <textarea class="form-control bevalue" id="comment" placeholder="Demo comment" name="comment"></textarea>
                                    <small class="w-100 red pl-3p verdana"></small>
                                </div>
                                <div class="wrap center-2 my-15p bsbb bblock-resp">
                                    <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                    <button type="button" class="btn btn-label-primary mx-10p capitalize bfull-resp bm-a-resp bmy-10p-resp">Request for tesing</button>
                                </div>
                            </form>
                        </div>`
        let form = a.querySelector("form");
        let inputs = Array.from(form.querySelectorAll('.form-control'))
        form.addEventListener('submit', event=>{
            event.preventDefault();
            l = 1
            for (const input of inputs) {
                v = checkEmpty(input);
                if (!v) {
                    l = 0
                }
            }
            if (l) {
                let values = {}
                for (const input of inputs) {
                    Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                } 
                console.log(values)
            }
        })
    }   
}
 

