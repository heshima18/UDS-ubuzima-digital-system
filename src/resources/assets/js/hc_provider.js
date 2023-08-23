import { alertMessage, getdata, getschema, postschema, request,deletechild, checkEmpty, showRecs, getchips,getPath, addUprofile,addsCard,cpgcntn, geturl,sessiondata,addChip, showAvaiAssurances } from "../../../utils/functions.controller.js";
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
    function gsd(page) {
        try {
            console.log(page)
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
                    let arb = f.querySelector('span#add-results');
                    let extras_input = Array.from(f.querySelectorAll('input.extras'));
                    extras_input.map(function (input) {
                      input.addEventListener('focus', event=>{
                        showRecs(input,extra[input.id],input.id)
                      })
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
                        addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder)
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
                        addChip({name:inp.value.trim(), id: inp.value.trim()},chipsHolder)
                        inp.value = null
                      }
                    })
                    n = i.find(function (e) {return e.id == 'patient'})
                    n.addEventListener('keyup', async f=>{
                      if (n.value) {
                        n.parentNode.querySelector('span').classList.replace('hidden','center-2')
                        postschema.body = JSON.stringify({token: getdata('token')})
                        const p = await request(`patient/${n.value.trim()}`,postschema)
                        if (!p.success) {
                         return n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                        }
                        n.parentNode.querySelector('span').classList.replace('center-2','hidden')
                        n.value = p.message.Full_name
                        n.setAttribute('data-id',p.message.id)
                        let a = await showAvaiAssurances(p.message.assurances)
                        l = Array.from(a.querySelectorAll('li.assurance'))
                        for (const lis of l) {
                          lis.addEventListener('click',async function(event){
                            console.log(p)
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
                    })
                    if (sessiondata('pinfo')) {
                      n.value = sessiondata('pinfo').name
                      n.setAttribute('data-id',sessiondata('pinfo').patient)
                    }
                    n.addEventListener('focus',()=>{
                        if (sessiondata('pinfo')) {
                            n.value = sessiondata('pinfo').nid
                            n.setAttribute('data-id',sessiondata('pinfo').patient)
                          }
                    })
                    n.addEventListener('blur',()=>{
                        if (sessiondata('pinfo')) {
                            n.value = sessiondata('pinfo').name
                            n.setAttribute('data-id',sessiondata('pinfo').patient)
                        }
                    })
                    b = f.querySelector('button[type="submit"]')
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
                                Object.assign(b,{[input.name]: getchips(input.parentNode.querySelector('div.chipsholder'))})
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
                            r = await request('addsession',postschema);
                            alertMessage(r.message)
                        }
                    }) 
                } catch (error) {
                console.log(error)  
                }
            } 
            
          } catch (error) {
            console.log(error)
          }
    }
})();

 

