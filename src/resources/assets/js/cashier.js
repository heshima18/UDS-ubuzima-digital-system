import { alertMessage, getdata, getschema, postschema, request,initializeCleave,sessiondata,addLoadingTab,removeLoadingTab, checkEmpty, showRecs, getchips,getPath,addsCard,cpgcntn, geturl, adcm, addshade, deletechild, RemoveAuthDivs, showFingerprintDiv, addAuthDiv } from "../../../utils/functions.controller.js";
import { addUprofile } from "../../../utils/user.profile.controller.js";
import {expirateMssg, pushNotifs, userinfo} from "./nav.js";

let q,w,e,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,x,c,v,b,n,m,z,r,session_input,session_s_button,eventadded
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
                addsCard(message.title,true)

            });
            socket.on('messagefromserver', (message) => {
                alertMessage(message)

            });;
            socket.on('accessAuth', (message) => {
                addAuthDiv(socket,message);

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
    if (!users.success) {
        return alertMessage(users.message)
    }
    let extra = {users: users.message}
    a = getPath(1)
    c = Array.from(document.querySelectorAll('span.cpcards'))
    p = Array.from(document.querySelectorAll('div.pagecontentsection'))
    const vsd = p.find(function (div) {
        return div.id == 'view-session' 
    })
    const theb = vsd.querySelector('div.theb')
    const raw = theb.innerHTML
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
    window.addEventListener('popstate',  function () {
        const evnt = new Event('urlchange', { bubbles: true });
        window.dispatchEvent(evnt);
    })
    window.addEventListener('urlchange', function() {
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
                    if (getPath(2)) {
                        gsd(target,getPath(2))
                    }else{
                        gsd(target)
                    }
                    return 0
                }
            })
        }else{
            window.history.pushState('','','./home')
            cpgcntn(0,p)
    
        }    
    }); 
    c.forEach((cudstp)=>{
        cudstp.addEventListener('click',()=>{
            c.forEach((cp)=>{
                cp.classList.remove('active','bb-1-s-theme','bc-tr-theme','theme')
            })
            cudstp.classList.add('active','bb-1-s-theme','bc-tr-theme','theme')
            let url = new URL(window.location.href);
            url.pathname = `/cashier/${cudstp.getAttribute('data-item-type')}`;
            window.history.pushState({},'',url.toString())
            cpgcntn(c.indexOf(cudstp),p,extra)
            gsd(p.find(function (elem) {
                return elem.id == cudstp.getAttribute('data-item-type')
            }))
        })
    })
    async function gsd(page,extra) {
        try {
            x = page.id
            if (x == 'search-patient') {
                
                f = page.querySelector('form[name="sp-form"]');
                s = f.querySelector('input[type="text"]');
                setTimeout(e=>{s.focus()},200)
                b = f.querySelector('button[type="submit"]')
                if (getPath(2)) {
                    b.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                    b.setAttribute('disabled',true)
                    r = await request(`patient/${getPath(2)}`,postschema)
                    s.value = getPath(2)
                    b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                    b.removeAttribute('disabled')
                    if (!r.success) return alertMessage(r.message)
                    addUprofile(r.message);
                }
                let fingerprint = page.querySelector('span#fingerprint')
                fingerprint.onclick = async function () {
                let fp_data = await showFingerprintDiv('search');
                if (fp_data) {
                    postschema.body = JSON.stringify({
                        token: getdata('token'),
                        fp_data,
                        type: 'fp'
                    })
                    r = await request(`patient/`,postschema)
                    RemoveAuthDivs();
                    if (!r.success) return alertMessage(r.message)
                    addUprofile(r.message);
                    let url = new URL(window.location.href);
                    url.pathname = `/cashier/search-patient/${r.message.id}`;
                    window.history.pushState({},'',url.toString())
                }
                }
                f.onsubmit = async e=>{
                    e.preventDefault();
                    if (!s.value) return 0
                    b.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                    b.setAttribute('disabled',true)
                    r = await request(`patient/${s.value}`,postschema)
                    b.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                    b.removeAttribute('disabled')
                    if (!r.success) return alertMessage(r.message)
                    addUprofile(r.message);
                    let url = new URL(window.location.href);
                    url.pathname = `/hc_provider/search-patient/${s.value}`;
                    window.history.pushState({},'',url.toString())
            
                }
            
            }else if (x == 'my-account') {
                n = page.querySelector('span.name')
                z = getdata('userinfo')
                n.textContent = z.Full_name
                i = page.querySelector('span-img');
                i.textContent = z.Full_name.substring(0,1)
                let editbuts = Array.from(page.querySelectorAll('span.icon-edit-icon'))
                for (const button of editbuts) {
                    button.addEventListener('click',()=>{
                        l = button.getAttribute('data-target')
                        shedtpopup(l,r);
                    })
                }
          
            }else if (x == 'view-session') {
                theb.innerHTML = raw
                if (extra) {
                    let url = new URL(window.location.href);
                    url.pathname = `/cashier/view-session/${extra}`;
                    window.history.pushState({},'',url.toString())
                }
                let session = getPath(2)
                addLoadingTab(page.querySelector('div.theb'));
                session_input = page.querySelector('input#session-id');
                session_s_button = page.querySelector('button[name="session-search"]');
                if (!eventadded) {
                    session_s_button.addEventListener('click', async event=>{
                    event.preventDefault();
                    if (session_input.value) {
                        if (!session) {
                            removeLoadingTab(page.querySelector('div.theb'));
                        }
                        session = session_input.value;
                        postschema.body = JSON.stringify({token: getdata('token')})
                        addLoadingTab(page.querySelector('div.theb'));
                        session_s_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                        session_s_button.setAttribute('disabled',true)
                        let sessiondata =  await request(`session/${session}`,postschema)
                        if (sessiondata.success) {
                            theb.innerHTML = raw
                        }
                        session_s_button.innerHTML = `<i class="bx bx-search h-20p w-a center"></i>`
                        session_s_button.removeAttribute('disabled')
                        if (!sessiondata.success) return alertMessage(sessiondata.message)
                        session_input.value = session
                        let url = new URL(window.location.href);
                        url.pathname = `/cashier/view-session/${session}`;
                        window.history.pushState({},'',url.toString())
                        sessiondata = sessiondata.message
                        showSession(sessiondata);
                    }
                    })
                    eventadded = 1
                }
              if (session) {
                postschema.body = JSON.stringify({token: getdata('token')})
                let sessiondata =  await request(`session/${session}`,postschema)
                if (!sessiondata.success) return alertMessage(sessiondata.message)
                session_input.value = session
                sessiondata = sessiondata.message
                showSession(sessiondata);     
              }
            }
            function showSession(sessiondata) {
                removeLoadingTab(page.querySelector('div.theb'))
                Object.assign(sessiondata.payment_info,{total_amount: Number(sessiondata.payment_info.a_amount) + Number(sessiondata.payment_info.p_amount)})
                const dataHolders = Array.from(document.querySelectorAll('[name="info-hol"]'))
                const loopingDataHolders = Array.from(document.querySelectorAll('ul[name="looping-info"]'))
                for (const element of loopingDataHolders) {
                    let dataToHold = element.getAttribute('data-hold');
                    let dataToShow = sessiondata[dataToHold]
                    for (const data of dataToShow) {
                        Object.assign(data,{total_amount: (Number(data.price) * Number(data.quantity)).toFixed(2)})
                        let clonedNode = element.cloneNode(true);
                        let dataHolders = Array.from(clonedNode.querySelectorAll('[name="looping-info-hol"]'))
                        if (clonedNode.getAttribute(`data-id-holder`)) {
                            clonedNode.setAttribute('data-id',data.id)
                        }
                        if (dataToHold == 'medicines') {
                            if (data.status == 'served') {
                                clonedNode.classList.add('bc-tr-green')
                                dataHolders.find(function(element) {return element.getAttribute('data-hold') == 'name'}).classList.replace('dgray','green')
                            }else{
                                clonedNode.classList.add('bc-gray')
                            }
                        }
                       for (const dataHolder of dataHolders) {
                        if (dataHolder.getAttribute(`data-id-holder`)) {
                            dataHolder.setAttribute('data-id',data.id)
                        }
                        if (dataHolder.getAttribute('data-hold').indexOf('quantity') != -1 || dataHolder.getAttribute('data-hold').indexOf('amount') != -1) {
                            dataHolder.innerText = adcm(data[dataHolder.getAttribute('data-hold')])
                        }else if (dataHolder.getAttribute('data-hold').indexOf('status') != -1) {
                            if (data[dataHolder.getAttribute('data-hold')] != 'served') {
                                dataHolder.innerText = `mark as served`
                                dataHolder.classList.replace('bc-gray','btn-label-primary')
                                dataHolder.setAttribute('data-active', true)
                            }else{
                                dataHolder.innerText = data[dataHolder.getAttribute('data-hold')]

                            }
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
                            }else if (objectId[1].indexOf('status') != -1 && objectId[0].indexOf('payment_info') != -1) {
                                if (sessiondata[objectId[0]][objectId[1]] == 'paid') {
                                    holder.classList.replace('bc-gray','bc-tr-green')
                                }
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                                
                            }else{
                                holder.innerText = sessiondata[objectId[0]][objectId[1]]
                            }
                        }else{
                            if (holder.getAttribute('data-hold').indexOf('status') != -1) {
                                if (sessiondata[holder.getAttribute('data-hold')] == "open") {
                                    holder.classList.replace('bc-gray','bc-tr-green')
                                }
                            }
                            holder.innerText = sessiondata[objectId]
                        }
                }
                let mark_buttons = Array.from(page.querySelectorAll('span.mark-button'))
                let bigbuttons = Array.from(page.querySelectorAll('span.data-buttons'))
               mark_buttons = mark_buttons.filter(function (button) {
                return button.getAttribute('data-active') == 'true'
               })
               mark_buttons.map(function(button) {
                button.addEventListener('click', async function() {
                    if (button.classList.contains('loading')) {
                        return 0
                    }
                    let medid = this.getAttribute('data-id')
                    postschema.body = JSON.stringify({
                        token: getdata('token'),
                        medicines : [medid],
                        session: sessiondata.session_id
                    })
                    button.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`
                    button.setAttribute('disabled',true)
                    let results = await request('mark-as-served',postschema)
                    button.classList.remove('loading')
                    button.removeAttribute('disabled')
                    if (results.success) {
                        button.innerHTML = `served`
                        button.classList.replace('btn-label-primary','btn-label-secondary')
                        let parent = button.parentNode.parentNode.parentNode
                        parent.classList.replace('bc-gray','bc-tr-green')
                        button.removeAttribute(`data-active`)
                        parent.querySelector('span.card-title').classList.replace('dgray','green')
                        mark_buttons = Array.from(page.querySelectorAll('span.mark-button'))
                        mark_buttons = mark_buttons.filter(function (button) {
                            return button.getAttribute('data-active') == 'true'
                        })
                    }else{
                        button.innerHTML = `mark as served`
                    }
                    alertMessage(results.message)
                })
               })
               bigbuttons.map(function (button) {
                    if (sessiondata.payment_info.status != 'awaiting payment' && button.getAttribute('data-role') == 'approve-payment') {
                       button.classList.add('loading')
                       button.classList.replace('btn-label-success','btn-label-secondary')
                       button.innerHTML = `this session is already paid`
                    }else if (sessiondata.payment_info.status != 'awaiting payment' && button.getAttribute('data-role') == 'request-payment') {
                      deletechild(button, button.parentElement)
                    }
                   button.addEventListener('click', async function (event) {
                        let role = this.getAttribute('data-role')
                        if (role == 'approve-payment' && !button.classList.contains('loading')) {
                            if (sessiondata.payment_info.status == 'paid') {
                                return alertMessage('this session is already paid')
                            }
                            postschema.body = JSON.stringify({
                                session: sessiondata.session_id,
                                token: getdata('token')
                            })
                            button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                            button.setAttribute('disabled',true)
                            let result = await request('approve-payment',postschema)
                            if (result.success) {
                                button.innerHTML = `this session is already paid`
                                button.classList.replace('btn-label-success','btn-label-secondary')
                                button.classList.add('loading')
                                document.querySelector('span.status-holder').classList.replace('btn-label-secondary','btn-label-success')
                                document.querySelector('span.status-holder').innerText = `paid`
                                sessiondata.payment_info.status = 'paid'
                            }else{
                                button.innerHTML = `approve payment`
                            }
                            alertMessage(result.message)

                            
                        }else if (role == 'comment') {
                        let comment = async (data) =>{
                            const session = sessiondata
                            let commentsP = addshade();
                            a = document.createElement('div');
                            commentsP.appendChild(a)
                            a.className = "w-350p h-a p-10p bsbb bc-white cntr zi-10000 br-5p b-mgc-resp card" 
                            a.innerHTML  =`<div class="head w-100 h-50p py-10p px-15p bsbb">
                                                <span class="fs-18p bold-2 dgray capitalize igrid h-100 card-title">add an operation to session</span>
                                            </div>
                                            <div class="body w-100 h-a p-5p grid">
                                                <form method="post" id="req-test-info-form" name="req-test-info-form">
                                                    <div class="col-md-12 px-10p py-6p bsbb p-r">
                                                        <label for="test" class="form-label">comment</label>
                                                        <textarea class="form-control" id="comment" placeholder="Demo comment" name="comment">${data}</textarea>
                                                        <small class="w-100 red pl-3p verdana"></small>
                                                    </div>
                                                    <div class="wrap center-2 my-15p bsbb bblock-resp">
                                                        <button type="submit" class="btn btn-primary mx-10p bfull-resp bm-a-resp bmy-10p-resp">Proceed</button>
                                                    </div>
                                                </form>
                                            </div>`
                            let form = a.querySelector("form");
                            let inputs = Array.from(form.querySelectorAll('.form-control'))
                            form.addEventListener('submit', async event=>{
                                
                                event.preventDefault();
                                l = 1
                                for (const input of inputs) {
                                    v = checkEmpty(input);
                                    if (!v) {
                                        l = 0
                                    }
                                }
                                if (l) {
                                let button = form.querySelector('button[type="submit"]')
                                button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                                button.setAttribute('disabled',true)
                                    let values = {}
                                    for (const input of inputs) {
                                        Object.assign(values,{[input.name]: (input.classList.contains('bevalue'))? input.getAttribute('data-id') : input.value })
                                    } 
                                    Object.assign(values,{session: session.session_id,token: getdata('token')})
                                    postschema.body = JSON.stringify(values)
                                    let results = await request('add-session-comment',postschema)
                                    if (results.success) {
                                        deletechild(commentsP,commentsP.parentElement)
                                    }
                                    alertMessage(results.message)
                                    button.removeAttribute('disabled')
                                    button.innerHTML= 'proceed'
                    
                                }
                            })
                        }
                        comment(sessiondata.comment)
                        }
                    
                    })
               })            
            }
            
          } catch (error) {
            console.log(error)
          }
    }
})();

 

