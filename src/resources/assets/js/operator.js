import { alertMessage, getdata, getschema, postschema, request,initializeCleave,sessiondata, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl } from "../../../utils/functions.controller.js";
import {expirateMssg, getNfPanelLinks, pushNotifs, userinfo,m as messages} from "./nav.js";

let q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,notificationlinks
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
        z = z.message
        try {
            const socket = io(geturl(),{ query : { id: z.id} });
            socket.on('connect', () => {
            console.log('Connected to the server');
            });
            
            socket.on('message', (message) => {
                pushNotifs(message);
                messages.push(message)
                notificationlinks = getNfPanelLinks()
                genClicks(notificationlinks)
                addsCard(message.title,true)

            });
            socket.on('expiratemssg', (message) => {
                expirateMssg(message);
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
    f = await request('get-tests',postschema)
    if (!f.success) {
        return alertMessage(f.message)
    }
    let extra = {users: users.message, tests: f.message}
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
                    gsd(target)
                    return 0
                }
            })
        }else{
            window.history.pushState('','','./home')
            cpgcntn(0,p)
            gsd(p[0])
    
        }
    }
    c.forEach((cudstp)=>{
        cudstp.addEventListener('click',()=>{
        c.forEach((cp)=>{
            cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
        })
        cudstp.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
        let url = new URL(window.location.href);
        url.pathname = `/laboratory_scientist/${cudstp.getAttribute('data-item-type')}`;
        window.history.pushState({},'',url.toString())
        cpgcntn(c.indexOf(cudstp),p,extra)
        gsd(p[c.indexOf(cudstp)])
        })
    })
    notificationlinks = getNfPanelLinks()
    genClicks(notificationlinks)
    function genClicks(notificationlinks) {
        let messages = sessiondata('messages')
        notificationlinks.map((link)=>{
            link.addEventListener(`click`, ()=>{
                if (!link.classList.contains('list-link')) {
                    return 0
                }
                v = document.querySelector(`div#${link.getAttribute('data-href-target')}`)
                let message = messages.find(function (mess) {
                    return mess.id == link.getAttribute('data-id')
                })
                if (v && message) {
                p = Array.from(v.parentElement.querySelectorAll('.pagecontentsection'))
                
                s = p.indexOf(v)
                let url = new URL(window.location.href);
                let sessioninfo
                if (link.getAttribute('data-message-type') == 'req_test_message' || link.getAttribute('data-message-type') == 'session_message') {
                    if (message.addins) {
                        sessioninfo = message.addins
                    }else if (message.extra) {
                        sessioninfo = message.extra
                    }
                    if (sessioninfo) {
                        url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                    }
                }else{
                    url.pathname = `/${getPath()[0]}/${link.getAttribute('data-href-target')}`;
                }
                window.history.pushState({},'',url.toString())
                cpgcntn(p.indexOf(v),p)
                gsd(v,message)
               }
            })
        })
    }
})();
async function gsd(page,extra) {
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
      
        }else if (x == 'record-tests') {
            try {
                f = document.querySelector('form#record-test-form')
                i = Array.from(f.querySelectorAll('.form-control'))
                let extras_input = Array.from(f.querySelectorAll('input.extras'));
                let op_input = f.querySelector('input[name="operations"]');
                extras_input.map(function (input) {
                  input.addEventListener('focus', event=>{
                    showRecs(input,extra[input.id],input.id)
                  })
                })
                n = i.find(function (e) {return e.id == 'patient'})
                s = i.find(function (e) {return e.id == 'session'})
                t = i.find(function (e) {return e.id == 'test'})
                if (extra) {
                let session
                if (extra.addins) {
                    session = extra.addins
                }else if (extra.extra) {
                    session = extra.extra
                }
                  n.value = session.patient_name
                  n.setAttribute('data-id',session.patient)
                  s.value = `${session.patient_name}'s session`
                  s.setAttribute('data-id',session.session)
                  n.setAttribute('disabled',true),s.setAttribute('disabled',true),t.setAttribute('disabled',true)
                  t.value = `${session.t_name}`
                  t.setAttribute('data-id',session.test)
                }
                let button = f.querySelector('button[type="submit"]')
                f.onsubmit =  async e =>{
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
                        Object.assign(b,{test: {id:b.test, result: b.result, sample: b.sample}})
                        delete b.sample
                        delete b.result
                        Object.assign(b,{ token: getdata('token')})
                        postschema.body = JSON.stringify(b)
                        button.setAttribute('disabled',true)
                        button.textContent = 'recording session test info...'
                        r = await request('add-session-test',postschema);
                        button.removeAttribute('disabled',true)
                        button.textContent = 'submit test'
                        alertMessage(r.message)
                        if (r.success) {
                            f.reset();
                            j = {}
                            Object.assign(j, 
                                {
                                    token: getdata('token'),
                                    title:'incoming test results',
                                    token: getdata('token'),
                                    receiver: extra.sender.id,
                                    type: 'test_res_message', 
                                    content: `the results of ${session.t_name} for  ${session.patient_name} are ready to view`,
                                    extra: {
                                        test: session.test,
                                        t_name: session.t_name,
                                        session: session.session, 
                                        patient: session.patient
                                    },
                                    controller: {
                                        looping: false,
                                        recipients: []
                                    }
                                }
                            )
                            sessionStorage.removeItem('pinfo')
                            try {
                                postschema.body = JSON.stringify(j)
                                r =  await request('send-message',postschema)
                                if (!r.success) {
                                    return alertMessage(r.message)
                                }
                                addsCard('session owner notified !',true)
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                }
            } catch (error) {
            console.log(error)  
            }
        }
        
      } catch (error) {
        console.log(error)
      }
}

 

